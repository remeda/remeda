/**
 * Size changes don't show up in a PR's diff, so these tests pin them. They
 * measure the built package: run `npm run build` first.
 */

import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";
import { build, type BuildOptions } from "esbuild";
import { expect, test } from "vitest";

// Package sizes are in kB (1,000 B), the unit npm and npmjs.com report them in.
const SIZE_UNIT = 1000;

// The unpacked size of the published package, as `npm pack` reports it; users
// see it when auditing their install size. Every function and doc comment
// moves it, so the tests only fail once it drifts past the threshold, and the
// changes accumulate across PRs until this baseline is updated.
const EXPECTED_PACKAGE_SIZE = 1461;
const PACKAGE_SIZE_THRESHOLD = 0.03;

const NUM_FILES_REPORTED = 5;

const PACKAGE_DIR = path.resolve(import.meta.dirname, "..");
const DIST_ENTRY = JSON.stringify(path.join(PACKAGE_DIR, "dist", "index.js"));

const PACK_COMMAND = "npm pack --dry-run --json --ignore-scripts";

// The 15 most imported functions after `pipe` in a survey of public code
// (October 2026).
const TOP_15 = [
  "clone",
  "entries",
  "filter",
  "groupBy",
  "isDeepEqual",
  "isEmpty",
  "isPlainObject",
  "isTruthy",
  "keys",
  "map",
  "mapValues",
  "omit",
  "pick",
  "sortBy",
  "unique",
];

// Imports as a project writes them, bundled the way its bundler would, with
// and without `pipe`.
const BUNDLE_ENTRIES = {
  map: exportsOf("map"),
  "filter + map": exportsOf("filter", "map"),
  pipe: exportsOf("pipe"),
  "pipe + map + filter + take": exportsOf("pipe", "map", "filter", "take"),
  "top 15": exportsOf(...TOP_15),
  "pipe + top 15": exportsOf("pipe", ...TOP_15),
  "whole library": `export * from ${DIST_ENTRY};`,
};

const BUNDLE_OPTIONS = {
  bundle: true,
  minify: true,
  format: "esm",
  platform: "neutral",
  write: false,
  logLevel: "silent",
} as const satisfies BuildOptions;

const GZIP_OPTIONS = { level: 9 } as const;

const SIZE_FORMAT_OPTIONS = {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 1,
} as const satisfies Intl.NumberFormatOptions;
const SIZE_FORMATTER = new Intl.NumberFormat("en-US", SIZE_FORMAT_OPTIONS);
const SIZE_CHANGE_FORMATTER = new Intl.NumberFormat("en-US", {
  ...SIZE_FORMAT_OPTIONS,
  signDisplay: "exceptZero",
});
const PERCENT_CHANGE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

test("package grows within the threshold", async () => {
  const pack = await packDryRun();
  const size = pack.unpackedSize / SIZE_UNIT;

  expect(
    size,
    `${packageSizeReport(pack)}\nIf the growth since the baseline is expected (e.g., new functions), set EXPECTED_PACKAGE_SIZE to ${Math.round(size).toString()}; otherwise find what grew first`,
  ).toBeLessThanOrEqual(EXPECTED_PACKAGE_SIZE * (1 + PACKAGE_SIZE_THRESHOLD));
});

test("package shrinks within the threshold", async () => {
  const pack = await packDryRun();
  const size = pack.unpackedSize / SIZE_UNIT;

  expect(
    size,
    `${packageSizeReport(pack)}\nIf the package shrank on purpose, set EXPECTED_PACKAGE_SIZE to ${Math.round(size).toString()}; otherwise check dist for lost content, such as declarations without their JSDoc`,
  ).toBeGreaterThanOrEqual(
    EXPECTED_PACKAGE_SIZE * (1 - PACKAGE_SIZE_THRESHOLD),
  );
});

test("bundle sizes", async () => {
  // Bundle sizes are exact: a change of a few bytes in a shared helper
  // multiplies across every function using it. Regenerate with
  // `npm run test:size -- -u`.
  expect(
    Object.fromEntries(
      await Promise.all(
        Object.entries(BUNDLE_ENTRIES).map(
          async ([name, entry]) => [name, await bundleSize(entry)] as const,
        ),
      ),
    ),
  ).toMatchInlineSnapshot(`
    {
      "filter + map": "285 B gzip, 477 B minified",
      "map": "202 B gzip, 270 B minified",
      "pipe": "1016 B gzip, 2232 B minified",
      "pipe + map + filter + take": "1387 B gzip, 3056 B minified",
      "pipe + top 15": "2516 B gzip, 6850 B minified",
      "top 15": "1671 B gzip, 4626 B minified",
      "whole library": "10999 B gzip, 35781 B minified",
    }
  `);
});

// The fields of an `npm pack --json` entry that these tests read.
type PackResult = {
  readonly unpackedSize: number;
  readonly files: readonly { readonly path: string; readonly size: number }[];
};

function exportsOf(...names: readonly string[]): string {
  return `export { ${names.join(", ")} } from ${DIST_ENTRY};`;
}

async function packDryRun(): Promise<PackResult> {
  // `exec` runs the command in a shell so that `npm` also resolves on Windows,
  // where it's a `.cmd` script that can't be spawned directly.
  const { stdout } = await promisify(exec)(PACK_COMMAND, { cwd: PACKAGE_DIR });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access -- `npm pack --json` prints an array with an entry per packed package, and we pack exactly one.
  return JSON.parse(stdout)[0];
}

function packageSizeReport({ unpackedSize, files }: PackResult): string {
  const size = unpackedSize / SIZE_UNIT;
  const drift = size - EXPECTED_PACKAGE_SIZE;
  return [
    `Package is ${SIZE_FORMATTER.format(size)}: ${SIZE_CHANGE_FORMATTER.format(drift)} (${PERCENT_CHANGE_FORMATTER.format(drift / EXPECTED_PACKAGE_SIZE)}) from the ${SIZE_FORMATTER.format(EXPECTED_PACKAGE_SIZE)} baseline (EXPECTED_PACKAGE_SIZE in test/size.test.ts), past the +-${(PACKAGE_SIZE_THRESHOLD * 100).toString()}% threshold (+-${SIZE_FORMATTER.format(EXPECTED_PACKAGE_SIZE * PACKAGE_SIZE_THRESHOLD)}).`,
    "Changes accumulate across PRs until the baseline is updated, so this PR may own only part of the drift. The PRs since the baseline was set:",
    `  git log --oneline "$(git log -1 --format=%H -G 'EXPECTED_PACKAGE_SIZE =' -- :/packages/remeda/test/size.test.ts)..HEAD"`,
    "Largest files:",
    ...[...files]
      .sort(({ size: left }, { size: right }) => right - left)
      .slice(0, NUM_FILES_REPORTED)
      .map(
        ({ path: filePath, size: fileSize }) =>
          `  ${SIZE_FORMATTER.format(fileSize / SIZE_UNIT)}  ${filePath}`,
      ),
  ].join("\n");
}

async function bundleSize(entry: string): Promise<string> {
  const { outputFiles } = await build({
    ...BUNDLE_OPTIONS,
    stdin: { contents: entry, resolveDir: PACKAGE_DIR },
  });
  const code = Buffer.concat(outputFiles.map(({ contents }) => contents));
  return `${gzipSync(code, GZIP_OPTIONS).byteLength.toString()} B gzip, ${code.byteLength.toString()} B minified`;
}
