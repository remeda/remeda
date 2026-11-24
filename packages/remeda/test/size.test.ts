/**
 * Size changes don't show up in a PR's diff, so these tests pin them. They
 * measure the built package: run `npm run build` first.
 */

import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";
import { build, type BuildOptions } from "esbuild";
import { expect, test } from "vitest";

// Package sizes are in kB (1,000 B), the unit npm and npmjs.com report them in.
const SIZE_UNIT = 1000;

// The unpacked size of the published package in SIZE_UNITs, as `npm pack`
// reports it; users
// see it when auditing their install size. Every function and doc comment
// moves it, so the tests only fail once it drifts past the threshold, and the
// changes accumulate across PRs until this baseline is updated.
const EXPECTED_PACKAGE_SIZE = 1461;
const PACKAGE_SIZE_THRESHOLD = 0.03;

const NUM_FILES_REPORTED = 5;

// Keeps the `.d` of declaration files so they group apart from the runtime
// files they describe.
const FILE_EXTENSION_RE = /(?:\.d)?\.[^./]+$/u;

const PACKAGE_DIR = path.resolve(import.meta.dirname, "..");
const DIST_INDEX = path.join(PACKAGE_DIR, "dist", "index.js");
const DIST_ENTRY = JSON.stringify(DIST_INDEX);

const PACK_COMMAND = "npm pack --dry-run --json --ignore-scripts";

// The 15 most imported functions after `pipe` in a survey of public code
// (October 2026), ranked by the number of files importing each.
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

// Sizes come from the zlib bundled with official Node builds, the closest to
// what servers send; a Node linked against the system zlib reports different
// sizes.
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

// The fields of an `npm pack --json` entry that these tests read.
type PackResult = {
  readonly unpackedSize: number;
  readonly files: readonly { readonly path: string; readonly size: number }[];
};

// Without dist, `npm pack` would report a shrunken package instead.
if (!existsSync(DIST_INDEX)) {
  throw new Error("dist is missing: run `npm run build` first");
}

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
  // Bundle sizes are exact: a change of a few bytes in a shared helper shows
  // up in every import set that uses it.
  await expect(
    Promise.all(
      Object.entries(BUNDLE_ENTRIES).map(
        async ([name, entry]) => `${name}: ${await bundleSize(entry)}`,
      ),
    ),
    "Bundle sizes changed: run `npm run build`, then `npm run test:size -- -u` to update the snapshot",
  ).resolves.toMatchInlineSnapshot(`
    [
      "map: 270 B minified, 202 B gzip",
      "filter + map: 477 B minified, 285 B gzip",
      "pipe: 2232 B minified, 1016 B gzip",
      "pipe + map + filter + take: 3056 B minified, 1387 B gzip",
      "top 15: 4626 B minified, 1671 B gzip",
      "pipe + top 15: 6850 B minified, 2516 B gzip",
      "whole library: 35781 B minified, 10999 B gzip",
    ]
  `);
});

function exportsOf(...names: readonly string[]): string {
  return `export { ${names.join(", ")} } from ${DIST_ENTRY};`;
}

async function packDryRun(): Promise<PackResult> {
  // `exec` runs the command in a shell so that `npm` also resolves on Windows,
  // where it's a `.cmd` script that can't be spawned directly.
  const { stdout } = await promisify(exec)(PACK_COMMAND, { cwd: PACKAGE_DIR });
  // `npm pack --json` prints one entry per packed package, and we pack exactly
  // one: npm 12 keys the entries by package name, earlier versions list them in
  // an array.
  // @ts-expect-error [ts2322] -- The entry is `unknown` to TypeScript, but every npm version prints PackResult's fields in it.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- `JSON.parse` returns `any`, and `Object.values` reads both output shapes.
  return Object.values(JSON.parse(stdout))[0];
}

function packageSizeReport({ unpackedSize, files }: PackResult): string {
  const size = unpackedSize / SIZE_UNIT;
  const drift = size - EXPECTED_PACKAGE_SIZE;
  return [
    `Package is ${SIZE_FORMATTER.format(size)}: ${SIZE_CHANGE_FORMATTER.format(drift)} (${PERCENT_CHANGE_FORMATTER.format(drift / EXPECTED_PACKAGE_SIZE)}) from the ${SIZE_FORMATTER.format(EXPECTED_PACKAGE_SIZE)} baseline (EXPECTED_PACKAGE_SIZE in test/size.test.ts), past the +-${(PACKAGE_SIZE_THRESHOLD * 100).toString()}% threshold (+-${SIZE_FORMATTER.format(EXPECTED_PACKAGE_SIZE * PACKAGE_SIZE_THRESHOLD)}).`,
    "Changes accumulate across PRs until the baseline is updated, so this PR may own only part of the drift. The commits since the baseline was set:",
    `  git log --oneline "$(git log -1 --format=%H -G '^const EXPECTED_PACKAGE_SIZE =' -- :/packages/remeda/test/size.test.ts)..HEAD"`,
    `By extension: ${sizeByExtension(files)
      .map(
        ([extension, extensionSize]) =>
          `${extension} ${SIZE_FORMATTER.format(extensionSize / SIZE_UNIT)}`,
      )
      .join(", ")}`,
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

function sizeByExtension(
  files: PackResult["files"],
): readonly (readonly [extension: string, size: number])[] {
  const sizes = new Map<string, number>();
  for (const { path: filePath, size } of files) {
    const extension = FILE_EXTENSION_RE.exec(filePath)?.[0] ?? filePath;
    sizes.set(extension, (sizes.get(extension) ?? 0) + size);
  }
  return [...sizes].sort(([, left], [, right]) => right - left);
}

async function bundleSize(entry: string): Promise<string> {
  const { outputFiles } = await build({
    ...BUNDLE_OPTIONS,
    stdin: { contents: entry, resolveDir: PACKAGE_DIR },
  });
  const code = Buffer.concat(outputFiles.map(({ contents }) => contents));
  return `${code.byteLength.toString()} B minified, ${gzipSync(code, GZIP_OPTIONS).byteLength.toString()} B gzip`;
}
