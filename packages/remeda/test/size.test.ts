import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";
import { expect, test } from "vitest";

// Size changes don't show up in a PR's diff, so these tests pin them. They
// measure the built package: run `npm run build` first.

// The unpacked size of the published package in kB (1,000 B), as `npm pack`
// and npmjs.com report it; users see it when auditing their install size.
// Every function and doc comment moves it, so it's checked within a tolerance,
// and the changes accumulate across PRs until this baseline is updated. Update
// it when the change since it was last set is explained, e.g., by new functions
// or an intentional shrink; any other drift past the tolerance is a yellow
// flag: find what changed first.
const EXPECTED_PACKAGE_KB = 1461;
const PACKAGE_SIZE_TOLERANCE = 0.03;

const KILOBYTES = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 1,
});
const KILOBYTES_CHANGE = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});
const PERCENT_CHANGE = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

const LARGEST_FILES_REPORTED = 5;

const PACKAGE_DIR = path.resolve(import.meta.dirname, "..");
const DIST_ENTRY = JSON.stringify(path.join(PACKAGE_DIR, "dist", "index.js"));

// The 15 most imported functions after `pipe` in a survey of public code
// (October 2026).
const TOP_15 = [
  "sortBy",
  "map",
  "unique",
  "omit",
  "pick",
  "isTruthy",
  "mapValues",
  "filter",
  "isPlainObject",
  "isDeepEqual",
  "groupBy",
  "entries",
  "clone",
  "isEmpty",
  "keys",
];

// Imports as a project writes them, bundled the way its bundler would. Most
// projects call functions data-first and never import `pipe`, so the sets come
// with and without it.
const BUNDLE_ENTRIES = {
  "{ map }": exportsOf("map"),
  "{ filter, map }": exportsOf("filter", "map"),
  "{ pipe }": exportsOf("pipe"),
  "{ pipe, map, filter, take }": exportsOf("pipe", "map", "filter", "take"),
  "top 15": exportsOf(...TOP_15),
  "pipe + top 15": exportsOf("pipe", ...TOP_15),
  "whole library": `export * from ${DIST_ENTRY};`,
};

const { unpackedSize, files } = await packDryRun();
const packageKb = unpackedSize / 1000;
const driftKb = packageKb - EXPECTED_PACKAGE_KB;
const sizeReport = [
  `Package is ${KILOBYTES.format(packageKb)}: ${KILOBYTES_CHANGE.format(driftKb)} (${PERCENT_CHANGE.format(driftKb / EXPECTED_PACKAGE_KB)}) from the ${KILOBYTES.format(EXPECTED_PACKAGE_KB)} baseline (EXPECTED_PACKAGE_KB in test/size.test.ts), past its +-${(PACKAGE_SIZE_TOLERANCE * 100).toString()}% tolerance (+-${KILOBYTES.format(EXPECTED_PACKAGE_KB * PACKAGE_SIZE_TOLERANCE)}).`,
  `Changes accumulate across PRs until the baseline is updated, so this PR may own only part of the drift; \`git log -G "EXPECTED_PACKAGE_KB =" -- test/size.test.ts\` shows when it was last set.`,
  "Largest files:",
  ...[...files]
    .sort(({ size: left }, { size: right }) => right - left)
    .slice(0, LARGEST_FILES_REPORTED)
    .map(
      ({ path: filePath, size }) =>
        `  ${KILOBYTES.format(size / 1000)}  ${filePath}`,
    ),
].join("\n");

test("package grows within the tolerance", () => {
  expect(
    packageKb,
    `${sizeReport}\nIf the growth since the baseline is expected (e.g., new functions), set EXPECTED_PACKAGE_KB to ${Math.round(packageKb).toString()}; otherwise find what grew first`,
  ).toBeLessThanOrEqual(EXPECTED_PACKAGE_KB * (1 + PACKAGE_SIZE_TOLERANCE));
});

test("package shrinks within the tolerance", () => {
  expect(
    packageKb,
    `${sizeReport}\nIf the package shrank on purpose, set EXPECTED_PACKAGE_KB to ${Math.round(packageKb).toString()}; otherwise check dist for lost content, such as declarations without their JSDoc`,
  ).toBeGreaterThanOrEqual(EXPECTED_PACKAGE_KB * (1 - PACKAGE_SIZE_TOLERANCE));
});

// Bundle sizes are exact: a change of a few bytes in a shared helper multiplies
// across every function using it. Regenerate with `npm run test:size -- -u`.
test("bundle sizes", async () => {
  const sizes = Object.fromEntries(
    await Promise.all(
      Object.entries(BUNDLE_ENTRIES).map(
        async ([name, contents]) => [name, await bundleSize(contents)] as const,
      ),
    ),
  );

  expect(sizes).toMatchInlineSnapshot(`
    {
      "pipe + top 15": "2516 B gzip, 6850 B minified",
      "top 15": "1671 B gzip, 4626 B minified",
      "whole library": "10999 B gzip, 35781 B minified",
      "{ filter, map }": "285 B gzip, 477 B minified",
      "{ map }": "202 B gzip, 270 B minified",
      "{ pipe }": "1016 B gzip, 2232 B minified",
      "{ pipe, map, filter, take }": "1387 B gzip, 3056 B minified",
    }
  `);
});

function exportsOf(...names: readonly string[]): string {
  return `export { ${names.join(", ")} } from ${DIST_ENTRY};`;
}

async function packDryRun(): Promise<{
  readonly unpackedSize: number;
  readonly files: readonly { readonly path: string; readonly size: number }[];
}> {
  // `exec` runs the command in a shell so that `npm` also resolves on Windows,
  // where it's a `.cmd` script that can't be spawned directly.
  const { stdout } = await promisify(exec)(
    "npm pack --dry-run --json --ignore-scripts",
    { cwd: PACKAGE_DIR },
  );
  const [result] = JSON.parse(stdout) as readonly [
    Awaited<ReturnType<typeof packDryRun>>,
  ];
  return result;
}

async function bundleSize(contents: string): Promise<string> {
  const { outputFiles } = await build({
    stdin: { contents, resolveDir: PACKAGE_DIR },
    bundle: true,
    minify: true,
    format: "esm",
    platform: "neutral",
    write: false,
    logLevel: "silent",
  });
  const code = Buffer.concat(outputFiles.map((file) => file.contents));
  return `${gzipSync(code, { level: 9 }).byteLength.toString()} B gzip, ${code.byteLength.toString()} B minified`;
}
