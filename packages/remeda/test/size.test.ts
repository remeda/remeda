import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";
import { expect, test } from "vitest";

// Size changes don't show up in a PR's diff, so these tests pin them. They
// measure the built package: run `npm run build` first.

// The unpacked size of the published package in bytes, as `npm pack` reports
// it; users see it when auditing their install size. Every function and doc
// comment moves it, so it's checked within a tolerance. A new function may need
// more room: the PR that adds it updates this number. Growth in any other PR,
// and any drop past the tolerance, is unexpected: find what changed before
// updating it.
const EXPECTED_PACKAGE_SIZE = 1_460_789;
const PACKAGE_SIZE_TOLERANCE = 0.03;

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
const sizeReport = [
  `Package size: ${unpackedSize.toString()} B, expected ${EXPECTED_PACKAGE_SIZE.toString()} B +-${(PACKAGE_SIZE_TOLERANCE * 100).toString()}% (EXPECTED_PACKAGE_SIZE in test/size.test.ts). Largest files:`,
  ...[...files]
    .sort(({ size: left }, { size: right }) => right - left)
    .slice(0, LARGEST_FILES_REPORTED)
    .map(({ path: filePath, size }) => `  ${size.toString()} B  ${filePath}`),
].join("\n");

test("package grows within the tolerance", () => {
  expect(
    unpackedSize,
    `${sizeReport}\nA PR that adds a function updates EXPECTED_PACKAGE_SIZE; in any other PR, find what grew first`,
  ).toBeLessThanOrEqual(EXPECTED_PACKAGE_SIZE * (1 + PACKAGE_SIZE_TOLERANCE));
});

test("package shrinks within the tolerance", () => {
  expect(
    unpackedSize,
    `${sizeReport}\nIf the PR shrinks the package on purpose, update EXPECTED_PACKAGE_SIZE; otherwise check dist for lost content, such as declarations without their JSDoc`,
  ).toBeGreaterThanOrEqual(
    EXPECTED_PACKAGE_SIZE * (1 - PACKAGE_SIZE_TOLERANCE),
  );
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
