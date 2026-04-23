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
      systemMessage: `post-edit-prettier: unexpected tool "${tool_name}" — the settings.json matcher should be "Write|Edit".`,
    };
  }

  try {
    const filePath = tool_input?.file_path;
    if (filePath === undefined) {
      return {
        systemMessage: `post-edit-prettier: "${tool_name}" payload missing tool_input.file_path — likely a Claude Code schema change.`,
      };
    }

    if (!existsSync(filePath)) {
      return {
        systemMessage: `post-edit-prettier: "${tool_name}" succeeded for ${filePath} but it's missing — removed or moved between the tool and this hook.`,
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
        additionalContext: `post-edit-prettier: failed for ${tool_input?.file_path ?? "<unknown>"}. ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
      },
    };
  }
});
