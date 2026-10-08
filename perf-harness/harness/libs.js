// Loads each library copy as its own module graph. Every copy lives at a
// different path, so the module loader gives each one separate module
// instances (separate `pipe`, `purry`, evaluators and feedback vectors) even
// though they share one process.
//
// Sources:
//   src     src/index.ts through vitest's module transform (vitest only)
//   dist    dist/index.js, the built ESM, loaded natively
//   cjs     dist/index.cjs through `require`
//   bundle  bundle/remeda.bundle.mjs, one scope-hoisted esbuild bundle of the
//           built ESM (scripts/build-dist.mjs writes it)

import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { copyPackageDir, copyRoot, expectedProtocol } from "./copies.js";
import { config } from "./env.js";

const require = createRequire(import.meta.url);

export function libEntryPath(id, source = config.source) {
  const packageDir = copyPackageDir(id);
  switch (source) {
    case "src": {
      return path.join(packageDir, "src", "index.ts");
    }
    case "dist": {
      return path.join(packageDir, "dist", "index.js");
    }
    case "cjs": {
      return path.join(packageDir, "dist", "index.cjs");
    }
    case "bundle": {
      return path.join(copyRoot(id), "bundle", "remeda.bundle.mjs");
    }
    default: {
      throw new Error(`Unknown source ${source}`);
    }
  }
}

const loaded = new Map();

/** Loads one copy from one source, without the cross-copy checks. */
export async function loadLib(id, source = config.source) {
  const cacheKey = `${source}:${id}`;
  if (!loaded.has(cacheKey)) {
    const entry = libEntryPath(id, source);
    if (!existsSync(entry)) {
      throw new Error(
        `Missing ${entry}. ${source === "src" ? "Re-create the snapshot (scripts/prepare.mjs)." : "Run scripts/build-dist.mjs (or scripts/prepare.mjs) first."}`,
      );
    }
    loaded.set(
      cacheKey,
      source === "cjs"
        ? require(entry)
        : await import(pathToFileURL(entry).href),
    );
  }
  return loaded.get(cacheKey);
}

export async function loadLibs(ids, source = config.source) {
  const result = new Map();
  for (const id of ids) {
    result.set(id, await loadLib(id, source));
  }
  assertDistinctAndExpected(result);
  return result;
}

/**
 * How the copy's code reached V8: rewritten by vitest's module runner (cross
 * module references become `__vite_ssr_import_N__.name` property reads) or
 * loaded by the runtime as-is.
 */
export function describeLoader(lib) {
  const source = lib.purry.toString() + lib.pipe.toString();
  return source.includes("__vite_ssr_") ? "vite-transformed" : "native";
}

export function detectProtocol(lib) {
  const dataLast = lib.map((value) => value);
  if (typeof dataLast.lazy !== "function") {
    return "no-lazy";
  }
  const evaluator = dataLast.lazy(...dataLast.lazyArgs);
  const result = evaluator(42, 0, [42]);
  if (
    typeof result === "object" &&
    result !== null &&
    "hasNext" in result &&
    result.next === 42
  ) {
    return "legacy";
  }
  return result === 42 ? "item-or-control" : "unknown";
}

function assertDistinctAndExpected(libs) {
  const entries = [...libs.entries()];
  for (const [id, lib] of entries) {
    const protocol = detectProtocol(lib);
    if (protocol !== expectedProtocol(id)) {
      throw new Error(
        `Lib "${id}" speaks the "${protocol}" protocol, expected "${expectedProtocol(id)}"`,
      );
    }
  }
  for (let left = 0; left < entries.length; left++) {
    for (let right = left + 1; right < entries.length; right++) {
      const [leftId, leftLib] = entries[left];
      const [rightId, rightLib] = entries[right];
      if (
        leftLib === rightLib ||
        leftLib.pipe === rightLib.pipe ||
        leftLib.map === rightLib.map ||
        leftLib.purry === rightLib.purry
      ) {
        throw new Error(`Libs "${leftId}" and "${rightId}" share functions`);
      }
    }
  }
}
