import { existsSync } from "node:fs";
import path from "node:path";
import { handleClaudeCodeHook } from "./lib/claude-code-hook.ts";
import { getPackageDirectory } from "./lib/path.ts";
import {
  multiScriptStopHandler,
  mutatingCommandStopHandler,
  readonlyCommandStopHandler,
} from "./lib/stop-handlers.ts";

const PACKAGE_DIRECTORY = getPackageDirectory("docs");

await handleClaudeCodeHook(
  multiScriptStopHandler(PACKAGE_DIRECTORY, [
    // Ensure the package is built locally, docs depend on it via the mono-repo.
    () =>
      existsSync(path.join(getPackageDirectory("remeda"), "dist", "index.js"))
        ? {}
        : {
            decision: "block",
            reason:
              "docs-local-ci-checks: packages/remeda/dist/index.js missing. Run `npm --workspace=remeda run build` first — docs resolves `remeda` imports against that build.",
          },

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=@remeda/docs", "run", "sync"],
    }),

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=@remeda/docs", "run", "check", "--", "--no-sync"],
    }),

    mutatingCommandStopHandler(
      {
        cmd: "npm",
        args: ["--workspace=@remeda/docs", "run", "lint"],
      },
      PACKAGE_DIRECTORY,
    ),

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=@remeda/docs", "run", "build", "--", "--no-sync"],
    }),
  ]),
);
