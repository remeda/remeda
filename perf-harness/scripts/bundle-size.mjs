// Consumer bundle size per copy: bundles a handful of import patterns against
// each copy's built dist (run scripts/build-dist.mjs first) with esbuild and
// rolldown, minified, and reports minified, gzip (level 9) and brotli
// (quality 11) bytes, with deltas against main. Also checks whether the
// UNEXPECTED_ACCESS_SENTINEL Proxy and its message survive tree-shaking, and
// diffs every copy's public declaration files against main's.
//
//   node scripts/bundle-size.mjs [--name bundle] [--copies main,branch,...]
//
// Default copies: main, branch and every usable variant copy (libs/COPIES.json).
// Writes results/<name>.json and results/<name>.md.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import * as esbuild from "esbuild";
import { rolldown } from "rolldown";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const { values } = parseArgs({
  options: {
    name: { type: "string", default: "bundle" },
    "if-missing": { type: "boolean", default: false },
    copies: { type: "string", default: "" },
  },
});

// --if-missing keeps a stage step resumable: a finished report is kept.
if (
  values["if-missing"] &&
  existsSync(path.join(PERF_DIR, "results", `${values.name}.md`))
) {
  process.stdout.write(`${values.name}: already done, skipped\n`);
  process.exit(0);
}

const { copyUsable, isVariantCopy, listCopies } =
  await import("../harness/copies.js");
const LIBS =
  values.copies === ""
    ? [
        "main",
        "branch",
        ...listCopies().filter((id) => isVariantCopy(id) && copyUsable(id)),
      ]
    : values.copies.split(",");
if (LIBS[0] !== "main") {
  throw new Error("--copies must start with main (the reference)");
}

const brotli = (code) =>
  brotliCompressSync(code, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;

const ENTRIES = {
  "import { map }": (dist) => `export { map } from ${JSON.stringify(dist)};`,
  "import { filter, map }": (dist) =>
    `export { filter, map } from ${JSON.stringify(dist)};`,
  "import { pipe }": (dist) => `export { pipe } from ${JSON.stringify(dist)};`,
  "import { pipe, map, filter, take }": (dist) =>
    `export { pipe, map, filter, take } from ${JSON.stringify(dist)};`,
  "import { unique }": (dist) =>
    `export { unique } from ${JSON.stringify(dist)};`,
  "whole library": (dist) => `export * from ${JSON.stringify(dist)};`,
};

// Fragments of the sentinel: the Proxy itself and its error message.
const SENTINEL_MESSAGE_FRAGMENT =
  "argument was read, but Remeda didn't provide it";

// Entry files and outputs are overwritten in place on every run.
mkdirSync(path.dirname(path.join(PERF_DIR, "results", values.name)), {
  recursive: true,
});

const workDir = path.join(PERF_DIR, ".bundle-work");
mkdirSync(workDir, { recursive: true });

function distFor(lib) {
  return path.join(PERF_DIR, "libs", lib, "packages", "remeda", "dist");
}

async function bundleWithEsbuild(entryFile) {
  const result = await esbuild.build({
    entryPoints: [entryFile],
    bundle: true,
    minify: true,
    format: "esm",
    platform: "neutral",
    write: false,
    logLevel: "silent",
  });
  return result.outputFiles[0].text;
}

async function bundleWithRolldown(entryFile) {
  const build = await rolldown({ input: entryFile, logLevel: "silent" });
  const { output } = await build.generate({ format: "esm", minify: true });
  await build.close();
  return output[0].code;
}

const BUNDLERS = { esbuild: bundleWithEsbuild, rolldown: bundleWithRolldown };

const rows = [];
for (const [entryName, makeEntry] of Object.entries(ENTRIES)) {
  for (const [bundlerName, bundle] of Object.entries(BUNDLERS)) {
    const row = { entry: entryName, bundler: bundlerName };
    for (const lib of LIBS) {
      const entryFile = path.join(
        workDir,
        `${lib}-${entryName.replaceAll(/\W+/gu, "_")}.js`,
      );
      writeFileSync(
        entryFile,
        `${makeEntry(path.join(distFor(lib), "index.js"))}\n`,
      );
      const code = await bundle(entryFile);
      row[lib] = {
        minified: Buffer.byteLength(code),
        gzip: gzipSync(code, { level: 9 }).length,
        brotli: brotli(code),
        hasProxy: code.includes("new Proxy"),
        hasSentinelMessage: code.includes(SENTINEL_MESSAGE_FRAGMENT),
      };
      writeFileSync(
        entryFile.replace(/\.js$/u, `.${bundlerName}.out.js`),
        code,
      );
    }
    rows.push(row);
  }
}

// --- Declarations -----------------------------------------------------------

// Comments (JSDoc, region markers) are skipped by consumers' type checker, so
// the comment-stripped diff is the one that bears on the public type surface
// and on consumer type-check time.
function stripComments(text) {
  return text
    .replaceAll(/\/\*[\s\S]*?\*\//gu, "")
    .replaceAll(/^\s*\/\/.*$/gmu, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== "")
    .join("\n");
}

function unifiedDiff(leftFile, rightFile) {
  return spawnSync("diff", ["-u", leftFile, rightFile], { encoding: "utf8" })
    .stdout;
}

const declarations = LIBS.slice(1).flatMap((lib) =>
  ["index.d.ts", "index.d.cts"].map((file) => {
    const mainFile = path.join(distFor("main"), file);
    const otherFile = path.join(distFor(lib), file);
    const mainText = readFileSync(mainFile, "utf8");
    const otherText = readFileSync(otherFile, "utf8");
    const strippedMain = path.join(workDir, `main.${file}`);
    const strippedOther = path.join(workDir, `${lib}.${file}`);
    writeFileSync(strippedMain, `${stripComments(mainText)}\n`);
    writeFileSync(strippedOther, `${stripComments(otherText)}\n`);
    const declarationDiff = unifiedDiff(strippedMain, strippedOther);
    return {
      lib,
      file,
      identical: mainText === otherText,
      declarationsIdentical: declarationDiff === "",
      mainBytes: Buffer.byteLength(mainText),
      otherBytes: Buffer.byteLength(otherText),
      declarationDiff,
      fullDiff: unifiedDiff(mainFile, otherFile),
    };
  }),
);

// --- Report -----------------------------------------------------------------

const signed = (value) => (value > 0 ? `+${value}` : String(value));
const yesNo = (value) => (value ? "yes" : "no");
const lines = [`# Bundle size: ${LIBS.join(", ")}`, ""];
lines.push(
  "Minified ESM bundles of each import pattern against the copies' built dist (`sideEffects: false` honored). gzip is level 9, brotli quality 11. Deltas are against main.",
  "",
  `| entry | bundler | copy | min | delta | gzip | delta | brotli | delta | sentinel Proxy | sentinel message |`,
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
);
for (const row of rows) {
  for (const lib of LIBS) {
    const stats = row[lib];
    const main = row.main;
    lines.push(
      `| ${row.entry} | ${row.bundler} | ${lib} | ${stats.minified} | ${lib === "main" ? "-" : signed(stats.minified - main.minified)} | ` +
        `${stats.gzip} | ${lib === "main" ? "-" : signed(stats.gzip - main.gzip)} | ` +
        `${stats.brotli} | ${lib === "main" ? "-" : signed(stats.brotli - main.brotli)} | ` +
        `${yesNo(stats.hasProxy)} | ${yesNo(stats.hasSentinelMessage)} |`,
    );
  }
}
lines.push("", "## Public declarations (against main)", "");
for (const declaration of declarations) {
  lines.push(
    `- ${declaration.lib} ${declaration.file}: text ${declaration.identical ? "identical" : "different"}, ` +
      `declarations with comments stripped ${declaration.declarationsIdentical ? "identical" : "DIFFERENT"} ` +
      `(main ${declaration.mainBytes} B, ${declaration.lib} ${declaration.otherBytes} B)`,
  );
}
for (const declaration of declarations.filter(
  (candidate) =>
    candidate.file === "index.d.ts" && !candidate.declarationsIdentical,
)) {
  lines.push(
    "",
    `### Declaration diff: ${declaration.lib} ${declaration.file} (comments stripped)`,
    "",
    "```diff",
    declaration.declarationDiff.split("\n").slice(2).join("\n").trimEnd(),
    "```",
  );
}
lines.push(
  "",
  `Full declaration diffs (including comments) are in results/${values.name}.json.`,
);

writeFileSync(
  path.join(PERF_DIR, "results", `${values.name}.json`),
  `${JSON.stringify({ rows, declarations }, undefined, 2)}\n`,
);
const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(
  `${lines.join("\n")}\n\n[bundle-size] written to ${mdFile}\n`,
);
