import {
  execFileSync,
  type ExecFileSyncOptionsWithStringEncoding,
} from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { SemanticVersion } from "./resolve-npm-alias.js";

const TYPESCRIPT_VERSIONS_CACHE_BASE = path.join(
  import.meta.dirname,
  "..",
  ".ts-cache",
);

const EXEC_OPTIONS = {
  encoding: "utf8",
  stdio: "pipe",
} satisfies ExecFileSyncOptionsWithStringEncoding;

export function loadTypeScript(
  version: SemanticVersion,
): typeof import("typescript") {
  const versionCacheDir = path.join(TYPESCRIPT_VERSIONS_CACHE_BASE, version);

  // Install into the cache on first use.
  if (!existsSync(versionCacheDir)) {
    execFileSync(
      "npm",
      ["install", "--prefix", versionCacheDir, `typescript@${version}`],
      EXEC_OPTIONS,
    );
  }

  const require = createRequire(path.join(versionCacheDir, "_"));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return require(path.join(versionCacheDir, "node_modules", "typescript"));
}
