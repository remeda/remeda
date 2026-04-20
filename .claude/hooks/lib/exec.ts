// Typed wrapper around `child_process.spawnSync` for hook steps. Captures
// stdout and stderr separately and together, and returns the exit code
// verbatim — hooks decide how to interpret non-zero exits (some commands
// like `git diff` use exit 1 as "found differences", not an error).

import {
  spawnSync,
  type SpawnSyncOptionsWithStringEncoding,
} from "node:child_process";

const SPAWN_SYNC_OPTIONS = {
  encoding: "utf8",
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  // Some vitest/coverage outputs can exceed the 1 MiB default.
  maxBuffer: 64 * 1024 * 1024, // 64 MiB,
} satisfies SpawnSyncOptionsWithStringEncoding;

export function runCommand(
  {
    cmd,
    args,
    cwd,
  }: {
    readonly cmd: string;
    readonly args: readonly string[];
    readonly cwd?: string;
  },
  throwOnFailure = false,
) {
  const { error, stdout, stderr, status, signal } = spawnSync(cmd, [...args], {
    cwd,
    ...SPAWN_SYNC_OPTIONS,
  });

  if (error !== undefined) {
    throw new Error(
      `Failed to spawn \`${cmd} ${args.join(" ")}\`: ${error.message}`,
    );
  }

  const combined = [stdout, stderr]
    .filter((stream) => stream.length > 0)
    .join("\n");

  if (throwOnFailure && status !== 0) {
    throw new Error(
      `Command \`${cmd} ${args.join(" ")}\` exited with code ${status?.toString() ?? signal ?? "<unknown>"}: ${combined}`,
    );
  }

  return { status, stdout, stderr, combined } as const;
}
