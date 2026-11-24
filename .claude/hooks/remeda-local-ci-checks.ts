import { handleClaudeCodeHook } from "./lib/claude-code-hook.ts";
import { getPackageDirectory } from "./lib/path.ts";
import {
  multiScriptStopHandler,
  mutatingCommandStopHandler,
  readonlyCommandStopHandler,
} from "./lib/stop-handlers.ts";

const PACKAGE_DIRECTORY = getPackageDirectory("remeda");

await handleClaudeCodeHook(
  multiScriptStopHandler(PACKAGE_DIRECTORY, [
    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=remeda", "run", "check"],
    }),

    mutatingCommandStopHandler(
      {
        cmd: "npm",
        args: ["--workspace=remeda", "run", "lint"],
      },
      PACKAGE_DIRECTORY,
    ),

    readonlyCommandStopHandler({
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
    }),

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=remeda", "run", "test:types"],
    }),
  ]),
);
