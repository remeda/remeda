import {
  spawnSync,
  type SpawnSyncOptionsWithStringEncoding,
} from "node:child_process";
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
import type { ClaudeCodeHookHandler } from "./claude-code-hook.ts";

const SPAWN_SYNC_OPTIONS = {
  encoding: "utf8",
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  // Some vitest/coverage outputs can exceed the 1 MiB default.
  maxBuffer: 64 * 1024 * 1024, // 64 MiB,
} satisfies SpawnSyncOptionsWithStringEncoding;

type CommandDefinition = {
  readonly cmd: string;
  readonly args: readonly string[];
  readonly cwd?: string;
};

export function multiScriptStopHandler(
  packageDirectory: string,
  scripts: readonly ClaudeCodeHookHandler<"Stop">[],
): ClaudeCodeHookHandler<"Stop"> {
  const packageName = `${path.basename(packageDirectory)}`;

  return async (input) => {
    try {
      const dirtyFilePaths = getDirtyFilePaths(packageDirectory);

      if (dirtyFilePaths.length === 0) {
        // No changes in this package so the checks are unlikely to be
        // valuable. We still nudge the agent because CLAUDE.md promises these
        // checks run on turn end — a silent skip risks overconfidence when the
        // turn's changes live elsewhere (other packages, root configs,
        // tooling).
        return {
          systemMessage: `local-ci-checks (packages/${packageName}): clean — skipped. Run its checks manually if your turn changed it indirectly.`,
        };
      }

      // System messages provide context to the user, we preserve them from all
      // scripts so that the user gets the full picture.
      const systemMessages: string[] = [];

      for (const script of scripts) {
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
      const preamble = `local-ci-checks (packages/${packageName})`;
      return {
        decision: "block",
        reason: `${preamble}: ${detail}`,
        systemMessage: `${preamble}: internal failure — see the block reason.`,
      };
    }
  };
}

export function readonlyCommandStopHandler(
  command: CommandDefinition,
): ClaudeCodeHookHandler<"Stop"> {
  return () => {
    const { status, stdout, stderr } = runCommand(command);
    return status === 0
      ? {}
      : {
          decision: "block",
          reason: `local-ci-checks: ${command.cmd} ${command.args.join(" ")} failed:\n\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`,
        };
  };
}

export function mutatingCommandStopHandler(
  command: CommandDefinition,
  packageDirectory: string,
): ClaudeCodeHookHandler<"Stop"> {
  return ({ stop_hook_active }) => {
    const dirtyFilePaths = getDirtyFilePaths(packageDirectory);

    const snapshotDir = mkdtempSync(path.join(tmpdir(), "claude-local-ci-"));
    try {
      for (const filePath of dirtyFilePaths) {
        const sourceFilePath = path.resolve(packageDirectory, filePath);
        if (!existsSync(sourceFilePath)) {
          // Deletions (staged or unstaged) leave no file to snapshot — the
          // post-lint diff naturally produces an empty patch and gets filtered
          // out downstream.
          continue;
        }

        const destinationFilePath = path.join(snapshotDir, filePath);
        mkdirSync(path.dirname(destinationFilePath), { recursive: true });
        copyFileSync(sourceFilePath, destinationFilePath);
      }

      const { status, stdout, stderr } = runCommand(command);
      if (status !== 0) {
        return {
          decision: "block",
          reason: `local-ci-checks: ${command.cmd} ${command.args.join(" ")} failed:\n\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`,
        };
      }

      const changed = dirtyFilePaths.flatMap((file) => {
        const patch = diff(
          path.join(snapshotDir, file),
          path.join(packageDirectory, file),
          file,
        );
        return patch.length > 0 ? [{ file, patch }] : [];
      });
      if (changed.length === 0) {
        return {};
      }

      if (stop_hook_active) {
        // If a mutating command still produces changes on a re-Stop we _might_
        // be in an infinite loop where changes are either being reverted,
        // cascading, or require manual intervention to resolve (this can
        // happen, for example, when lint has two contradicting rules); to avoid
        // this we signal it to the agent, but don't block the turn again.

        return {
          systemMessage: `local-ci-checks: ${command.cmd} ${command.args.join(" ")} modified ${String(changed.length)} file(s) on retry — review them:\n${changed.map(({ file }) => file).join("\n")}`,
        };
      }

      return {
        decision: "block",
        reason: `local-ci-checks: ${command.cmd} ${command.args.join(" ")} changed ${String(changed.length)} file(s). Review the diff:\n\n${changed.map(({ patch }) => patch).join("\n")}`,
      };
    } finally {
      rmSync(snapshotDir, { recursive: true, force: true });
    }
  };
}

function getDirtyFilePaths(cwd: string): readonly string[] {
  const { status, signal, stdout, stderr } = runCommand({
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
    cwd,
  });

  if (status !== 0) {
    throw new Error(
      `Command \`git status --porcelain\` exited with code ${status?.toString() ?? signal ?? "<unknown>"} when run on cwd '${cwd}'!\n\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`,
    );
  }

  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      // Porcelain v1 format: `XY path`, or `XY old -> new` for
      // renames/copies. The worktree-side path is always the last one.
      const pathPart = line.slice(3);
      const arrowIndex = pathPart.indexOf(" -> ");
      const absolutePath = path.resolve(
        env["CLAUDE_PROJECT_DIR"]!,
        arrowIndex === -1 ? pathPart : pathPart.slice(arrowIndex + 4),
      );

      // git prints paths relative to the repository root regardless of the
      // `cwd` we invoked it from. Callers want paths relative to `cwd`
      // (the package directory), so rebase via the repo root.
      return path.relative(cwd, absolutePath);
    });
}

function diff(
  fileAPath: string,
  fileBPath: string,
  canonicalFilePath: string,
): string {
  const { stdout, stderr, status } = runCommand({
    cmd: "git",
    args: [
      "--no-pager",
      "diff",
      "--no-index",
      "--no-color",
      "--",
      fileAPath,
      fileBPath,
    ],
  });
  if (status !== 0 && status !== 1) {
    throw new Error(
      `git diff --no-index failed for ${canonicalFilePath} (exit ${String(status)}): ${stderr}`,
    );
  }

  return stdout
    .split("\n")
    .map((line) => {
      if (line.startsWith("diff --git ")) {
        return `diff --git a/${canonicalFilePath} b/${canonicalFilePath}`;
      }

      if (line.startsWith("--- ")) {
        return `--- a/${canonicalFilePath}`;
      }

      if (line.startsWith("+++ ")) {
        return `+++ b/${canonicalFilePath}`;
      }

      return line;
    })
    .join("\n");
}

function runCommand({ cmd, args, cwd }: CommandDefinition) {
  const { error, ...rest } = spawnSync(cmd, [...args], {
    cwd,
    ...SPAWN_SYNC_OPTIONS,
  });

  if (error !== undefined) {
    throw new Error(
      `Failed to spawn \`${cmd} ${args.join(" ")}\`: ${error.message}`,
    );
  }

  return rest;
}
