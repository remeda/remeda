// Decodes a TypeScript Playground URL and type-checks the embedded code using
// the TypeScript compiler API. Outputs the source code, compiler options, and
// any diagnostics — giving Claude the same view the user sees in the
// playground.

import { computeCompilerOptions } from "./compiler-options.js";
import { decompressLZString } from "./lzstring.js";
import { outputMarkdown } from "./markdown.js";
import { runPlayground } from "./playground.js";

// We only support absolute URLs which resolve cleanly to the official
// playground!
const PLAYGROUND_ORIGIN = "https://www.typescriptlang.org";
const PLAYGROUND_PATHNAME = "/play";
const PLAYGROUND_CODE_HASH_PREFIX = "#code/";

export function main([urlString]: readonly string[]): void {
  if (urlString === undefined) {
    throw new Error("Usage: decode-playground.ts <playground-url>");
  }

  const url = new URL(urlString);
  if (
    url.origin !== PLAYGROUND_ORIGIN ||
    url.pathname !== PLAYGROUND_PATHNAME
  ) {
    throw new Error("Usage: decode-playground.ts <playground-url>");
  }

  const code = extractPlaygroundCode(url);

  // Install and load the TypeScript version specified in the URL's `ts` query
  // param (or `latest` if absent), caching each version in `.ts-cache/`.
  const version = url.searchParams.get("ts") ?? "latest";

  const compilerOptions = computeCompilerOptions(url.searchParams);

  const { effectiveVersion, diagnostics } = runPlayground(
    version,
    code,
    compilerOptions,
  );

  outputMarkdown({ code, diagnostics, effectiveVersion, compilerOptions });
}

function extractPlaygroundCode({ hash }: URL) {
  const [preamble, encoded] = hash.split(
    PLAYGROUND_CODE_HASH_PREFIX,
    2 /* parts */,
  );
  if (preamble !== "" || encoded === undefined) {
    throw new Error(`Failed to extract encoded code from hash: ${hash}`);
  }

  return [...decompressLZString(encoded)].join("");
}
