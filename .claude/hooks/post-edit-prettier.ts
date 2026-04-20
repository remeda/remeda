import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { format, getFileInfo, resolveConfig } from "prettier";
import { diff } from "./lib/diff.ts";
import { handleClaudeCodeHook } from "./lib/claude-code-hook.ts";

await handleClaudeCodeHook<"PostToolUse">(async ({ tool_name, tool_input }) => {
  if (tool_name !== "Write" && tool_name !== "Edit") {
    return {
      systemMessage: `post-edit-prettier: hook triggered for unexpected tool "${tool_name}". The matcher in .claude/settings.json should match only "Write|Edit".`,
    };
  }

  try {
    const filePath = tool_input?.file_path;
    if (filePath === undefined) {
      return {
        systemMessage: `post-edit-prettier: "${tool_name}" tool payload is missing tool_input.file_path. The hook cannot format anything until this is resolved — check the Claude Code release notes for a payload schema change.`,
      };
    }

    if (!existsSync(filePath)) {
      return {
        systemMessage: `post-edit-prettier: "${tool_name}" reported success for ${filePath} but the file isn't on disk. Something removed or moved it between the tool completing and this hook running.`,
      };
    }

    const { ignored, inferredParser } = await getFileInfo(filePath, {
      resolveConfig: true,
    });
    if (ignored || inferredParser === null) {
      // Prettier doesn't want to, or doesn't know how to, work with this file.
      return {};
    }

    const beforePrettier = readFileSync(filePath, "utf8");

    const config = await resolveConfig(filePath);
    const afterPrettier = await format(beforePrettier, {
      ...config,
      filepath: filePath,
    });
    if (afterPrettier === beforePrettier) {
      return {};
    }

    const tmp = mkdtempSync(path.join(tmpdir(), "hook-diff-"));
    try {
      const beforeTmpPath = path.join(tmp, `${path.basename(filePath)}.pre`);
      copyFileSync(filePath, beforeTmpPath);
      writeFileSync(filePath, afterPrettier);
      const changes = diff(beforeTmpPath, filePath);
      return {
        hookSpecificOutput: {
          additionalContext: `Prettier reformatted ${filePath}:\n\n${changes}`,
        },
      };
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  } catch (error) {
    return {
      hookSpecificOutput: {
        additionalContext: `post-edit-prettier (Write|Edit PostToolUse hook) failed for ${tool_input?.file_path ?? "<unknown>"}. ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
      },
    };
  }
});
