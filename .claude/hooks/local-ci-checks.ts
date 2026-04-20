import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { env } from "node:process";
import {
  handleClaudeCodeHook,
  type ClaudeCodeHookHandler,
} from "./lib/claude-code-hook.ts";
import { diff } from "./lib/diff.ts";
import { runCommand } from "./lib/exec.ts";

const REMEDA_PACKAGE_PATH = path.resolve(
  env["CLAUDE_PROJECT_DIR"]!,
  "packages",
  "remeda",
);

const DIRTY_CHECK_COMMAND = {
  cmd: "git",
  args: [
    "--no-pager",
    "status",
    "--porcelain",
    // The `.` pathspec scopes the output to files under `cwd`. Without it,
    // `git status --porcelain` reports repo-wide regardless of the working
    // directory.
    "--",
    ".",
  ],
};

const CHECK_COMMAND = {
  cmd: "npm",
  args: ["--workspace=remeda", "run", "check"],
};

const LINT_COMMAND = {
  cmd: "npm",
  args: ["--workspace=remeda", "run", "lint"],
};

const TEST_RUNTIME_COMMAND = {
  cmd: "npm",
  args: [
    "--workspace=remeda",
    "run",
    "test:coverage",
    // We add coverage limits so that we fail on any coverage drops. This is
    // usually enforced via CI as an action, but for agents we can enforce it
    // locally instead!
    "--",
    "--coverage.thresholds.lines=100",
    "--coverage.thresholds.functions=100",
    "--coverage.thresholds.branches=100",
    "--coverage.thresholds.statements=100",
  ],
};

const TEST_TYPES_COMMAND = {
  cmd: "npm",
  args: ["--workspace=remeda", "run", "test:types"],
};

const SCRIPTS: readonly ClaudeCodeHookHandler<"Stop">[] = [
  // check
  () => {
    const { status, combined } = runCommand(CHECK_COMMAND);
    return status === 0
      ? {}
      : {
          decision: "block",
          reason: `Typecheck failed:\n\n${combined}`,
        };
  },

  // lint
  ({ stop_hook_active }) => {
    const dirtyFilePaths = getDirtyFiles();
    const snapshotDir = snapshotDirtyFiles(dirtyFilePaths);
    try {
      const { status, combined } = runCommand(LINT_COMMAND);
      if (status !== 0) {
        return {
          decision: "block",
          reason: `Lint failed:\n\n${combined}`,
        };
      }

      const changed = dirtyFilePaths.flatMap((file) => {
        const patch = diff(
          path.join(snapshotDir, file),
          path.join(REMEDA_PACKAGE_PATH, file),
          file,
        );
        return patch.length > 0 ? [{ file, patch }] : [];
      });
      if (changed.length === 0) {
        return {};
      }

      if (stop_hook_active) {
        // eslint can have conflicting rules which revert each other's fixes. To
        // prevent falling into an infinite loop we need to stop early.

        return {
          systemMessage: `local-ci-checks: lint auto-fixed ${String(changed.length)} file(s) on a retry Stop — the agent didn't converge on the previous fixes. Accepting the fixes and allowing the turn to end. If the rule is wrong for this codebase, disable it rather than relying on the agent to accept it. Files:\n${changed.map(({ file }) => file).join("\n")}`,
        };
      }

      return {
        decision: "block",
        reason: `Lint auto-fixed ${String(changed.length)} file(s). Review the diff for correctness, then re-trigger Stop:\n\n${changed.map(({ patch }) => patch).join("\n")}`,
      };
    } finally {
      rmSync(snapshotDir, { recursive: true, force: true });
    }
  },

  // test:runtime
  () => {
    const { status, combined } = runCommand(TEST_RUNTIME_COMMAND);
    return status === 0
      ? {}
      : {
          decision: "block",
          reason: `Runtime tests or coverage failed:\n\n${combined}`,
        };
  },

  // test:types
  () => {
    const { status, combined } = runCommand(TEST_TYPES_COMMAND);
    return status === 0
      ? {}
      : {
          decision: "block",
          reason: `Type tests failed:\n\n${combined}`,
        };
  },
];

await handleClaudeCodeHook<"Stop">(async (input) => {
  try {
    const { stdout } = runCommand(
      {
        ...DIRTY_CHECK_COMMAND,
        cwd: REMEDA_PACKAGE_PATH,
      },
      true /* throwOnFailure */,
    );

    if (stdout.trim().length === 0) {
      // No changes in the remeda package, it's unlikely that these checks are
      // valuable. We still nudge the agent because CLAUDE.md promises these
      // checks run on turn end — a silent skip risks overconfidence when the
      // turn's changes live elsewhere (other packages, root configs, tooling).
      return {
        systemMessage:
          "local-ci-checks skipped — no dirty files in packages/remeda. The automatic quality checks did NOT run this turn. Run the checks relevant to whatever you touched manually before claiming the work is done.",
      };
    }

    // System messages provide context to the user, we preserve them from all
    // jobs so that the user gets the full picture.
    const systemMessages: string[] = [];

    for (const script of SCRIPTS) {
      const result = await script(input);

      if (result.systemMessage !== undefined) {
        systemMessages.push(result.systemMessage);
      }

      if (result.decision === "block") {
        return {
          ...result,
          systemMessage: systemMessages.join("\n\n"),
        };
      }
    }

    return {
      systemMessage: systemMessages.join("\n\n"),
    };
  } catch (error) {
    const detail =
      error instanceof Error ? (error.stack ?? error.message) : String(error);
    return {
      decision: "block",
      reason: `local-ci-checks: a step could not complete. ${detail}`,
      systemMessage: `local-ci-checks failed before producing a verdict — typically an infrastructure issue (missing binary, broken workspace, etc.). ${detail}`,
    };
  }
});

function getDirtyFiles(): readonly string[] {
  const { stdout } = runCommand(
    { ...DIRTY_CHECK_COMMAND, cwd: REMEDA_PACKAGE_PATH },
    true /* throwOnFailure */,
  );
  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      // Porcelain v1 format: `XY path`, or `XY old -> new` for
      // renames/copies. The worktree-side path is always the last one.
      const pathPart = line.slice(3);
      const arrowIndex = pathPart.indexOf(" -> ");
      return arrowIndex === -1 ? pathPart : pathPart.slice(arrowIndex + 4);
    });
}

function snapshotDirtyFiles(dirtyFilePaths: readonly string[]): string {
  const snapshotDir = mkdtempSync(path.join(tmpdir(), "workspace-diff-"));

  try {
    for (const filePath of dirtyFilePaths) {
      const sourceFilePath = path.resolve(REMEDA_PACKAGE_PATH, filePath);

      // Deletions (staged or unstaged) leave no file to snapshot — the post-lint
      // diff naturally produces an empty patch and gets filtered out downstream.
      if (!existsSync(sourceFilePath)) {
        continue;
      }

      const destinationFilePath = path.join(snapshotDir, filePath);
      mkdirSync(path.dirname(destinationFilePath), { recursive: true });
      copyFileSync(sourceFilePath, destinationFilePath);
    }

    return snapshotDir;
  } catch (error) {
    // cleanup
    rmSync(snapshotDir, { recursive: true, force: true });
    throw error;
  }
}
