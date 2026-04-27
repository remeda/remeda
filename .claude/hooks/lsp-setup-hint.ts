import { handleClaudeCodeHook } from "./lib/claude-code-hook.ts";

await handleClaudeCodeHook<"PostToolUse">(({ tool_response }) => {
  // TODO: We should refine where we look for the failure string to the actual place that LSP puts it in.
  const serialized = JSON.stringify(tool_response);

  const executableMissing =
    serialized.includes("Executable not found") &&
    serialized.includes("typescript-language-server");
  const noLocalInstall = serialized.includes(
    "typescript-language-server: no local install",
  );

  if (!executableMissing && !noLocalInstall) {
    return {};
  }

  return {
    hookSpecificOutput: {
      additionalContext: `The TypeScript LSP call failed because \`typescript-language-server\` isn't on PATH. This repo ships a CWD-aware shim at \`.claude/bin/typescript-language-server\` that walks up from the current directory to find the local \`node_modules/.bin/typescript-language-server\` devDependency. To enable it: 1. Confirm \`~/.local/bin\` is on the user's PATH; help them set it up if it isn't. 2. Offer to run the symlink install: \`mkdir -p ~/.local/bin && ln -sf "$(git rev-parse --show-toplevel)/.claude/bin/typescript-language-server" ~/.local/bin/typescript-language-server\` 3. Tell the user to restart Claude Code.`,
    },
  };
});
