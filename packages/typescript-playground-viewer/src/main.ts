import { computeCompilerOptions } from "./compiler-options.js";
import { decompressLZString } from "./lzstring.js";
import { outputMarkdown } from "./markdown.js";
import { runPlayground } from "./playground.js";
import { resolveNPMVersionAlias } from "./resolve-npm-alias.js";

// We only support absolute URLs which resolve cleanly to the official
// playground!
const PLAYGROUND_ORIGIN = "https://www.typescriptlang.org";
const PLAYGROUND_PATHNAME = "/play";
const PLAYGROUND_CODE_HASH_PREFIX = "#code/";

export async function main([
  scriptName,
  urlString,
]: readonly string[]): Promise<void> {
  if (urlString === undefined) {
    throw new Error(`Usage: ${scriptName ?? "<script>"} <playground-url>`);
  }

  const { origin, pathname, searchParams, hash } = new URL(urlString);
  if (origin !== PLAYGROUND_ORIGIN) {
    throw new Error(
      `Invalid playground URL origin: expected ${PLAYGROUND_ORIGIN} but got ${origin}`,
    );
  }

  if (pathname !== PLAYGROUND_PATHNAME) {
    throw new Error(
      `Invalid playground URL pathname: expected ${PLAYGROUND_PATHNAME} but got ${pathname}`,
    );
  }

  const [preamble, encoded] = hash.split(
    PLAYGROUND_CODE_HASH_PREFIX,
    2 /* parts */,
  );
  if (preamble !== "") {
    throw new Error(
      `Invalid playground URL hash: expected to start with ${PLAYGROUND_CODE_HASH_PREFIX} but got ${hash}`,
    );
  }

  if (encoded === undefined) {
    throw new Error(
      `Invalid playground URL hash: missing encoded code after ${PLAYGROUND_CODE_HASH_PREFIX}`,
    );
  }

  const fileType = searchParams.get("filetype") ?? "ts";
  if (fileType !== "ts") {
    // For now we only support the basic mode...
    throw new Error(
      `Unsupported filetype: expected "ts" or no filetype but got ${fileType}`,
    );
  }

  const code = [...decompressLZString(encoded)].join("");

  const effectiveVersion = await resolveNPMVersionAlias(
    "typescript",
    searchParams.get("ts"),
  );

  const compilerOptions = computeCompilerOptions(searchParams);

  const diagnostics = runPlayground(effectiveVersion, code, compilerOptions);

  outputMarkdown({ code, diagnostics, effectiveVersion, compilerOptions });
}
