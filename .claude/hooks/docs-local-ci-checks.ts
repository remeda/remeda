import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { handleClaudeCodeHook } from "./lib/claude-code-hook.ts";
import { getPackageDirectory } from "./lib/path.ts";
import {
  multiScriptStopHandler,
  mutatingCommandStopHandler,
  readonlyCommandStopHandler,
} from "./lib/stop-handlers.ts";

const PACKAGE_DIRECTORY = getPackageDirectory("docs");
const REMEDA_DIRECTORY = getPackageDirectory("remeda");
const REMEDA_DIST_ENTRY = path.join(REMEDA_DIRECTORY, "dist", "index.js");

await handleClaudeCodeHook(
  multiScriptStopHandler(PACKAGE_DIRECTORY, [
    // The docs package depends on the locally built remeda package. We need to
    // ensure that we aren't checking things against a stale (or missing)
    // version of the library.
    () => {
      if (!existsSync(REMEDA_DIST_ENTRY)) {
        return {
          decision: "block",
          reason: `${REMEDA_DIST_ENTRY} missing. Run \`npm --workspace=remeda run build\` first.`,
        };
      }

      const { mtimeMs } = statSync(REMEDA_DIST_ENTRY);
      const librarySourceDirectory = path.join(REMEDA_DIRECTORY, "src");
      if (hasFilesNewerThan(librarySourceDirectory, mtimeMs)) {
        return {
          decision: "block",
          reason: `${REMEDA_DIST_ENTRY} is stale (source changed since the last build). Run \`npm --workspace=remeda run build\`.`,
        };
      }

      return {};
    },

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=@remeda/docs", "run", "sync"],
    }),

    readonlyCommandStopHandler({
      cmd: "npm",
      args: ["--workspace=@remeda/docs", "run", "check", "--", "--noSync"],
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
      args: ["--workspace=@remeda/docs", "run", "build"],
    }),
  ]),
);

function hasFilesNewerThan(directory: string, timestampMs: number) {
  return readdirSync(directory, { withFileTypes: true, recursive: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        // Test files are not bundled into dist, so changes to them don't
        // invalidate
        // the build.
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".test-d.ts") &&
        !entry.name.endsWith(".test-prop.ts"),
    )
    .some(
      ({ name, parentPath }) =>
        statSync(path.join(parentPath, name)).mtimeMs > timestampMs,
    );
}
