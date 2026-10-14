// Vue dependency counts for more pipe shapes than scripts/reactive.mjs covers:
// the reactive probe's fused run, a lone lazy step in `pipe` that stops early,
// a lone `take`, and two data-first utilities, each inside a Vue `computed`
// over a reactive array of 1,000 observable items. Counts only (no timings),
// so the step is cheap and deterministic.
//
//   node scripts/vue-shapes.mjs [--name vue-shapes] [--copies main,branch]
//     [--if-missing]
//
// A copy "matches main" on a shape when its dependency count equals main's.
// Writes results/<name>.json and results/<name>.md.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const { values } = parseArgs({
  options: {
    name: { type: "string", default: "vue-shapes" },
    copies: { type: "string", default: "main,branch" },
    "if-missing": { type: "boolean", default: false },
  },
});
const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
if (values["if-missing"] && existsSync(mdFile)) {
  process.stdout.write(`${values.name}: already done, skipped\n`);
  process.exit(0);
}

// The production build, as an application ships it.
process.env.NODE_ENV = "production";
const vue = createRequire(path.join(PERF_DIR, "probes", "package.json"))(
  "@vue/reactivity",
);

const copies = values.copies.split(",").filter((id) => id !== "");
if (copies[0] !== "main") {
  throw new Error("--copies must start with main (the reference)");
}

export const SHAPES = {
  "pipe(items, filter, map, take(10))": (lib) => (items) =>
    lib.pipe(
      items,
      lib.filter((item) => item.active),
      lib.map((item) => item.value * 2),
      lib.take(10),
    ),
  "pipe(items, find(id === 20))": (lib) => (items) =>
    lib.pipe(
      items,
      lib.find((item) => item.id === 20),
    ),
  "pipe(items, take(10))": (lib) => (items) => lib.pipe(items, lib.take(10)),
  "find(items, id === 20) data-first": (lib) => (items) =>
    lib.find(items, (item) => item.id === 20),
  "filter(items, active) data-first": (lib) => (items) =>
    lib.filter(items, (item) => item.active),
};

const makeItems = () =>
  Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    active: index % 2 === 0,
    value: index,
  }));

const rows = [];
for (const copy of copies) {
  const lib = await import(
    pathToFileURL(
      path.join(
        PERF_DIR,
        "libs",
        copy,
        "packages",
        "remeda",
        "dist",
        "index.js",
      ),
    ).href
  );
  const row = { copy, dependencies: {} };
  for (const [shape, make] of Object.entries(SHAPES)) {
    const run = make(lib);
    const state = vue.reactive({ items: makeItems() });
    const result = vue.computed(() => run(state.items));
    void result.value;
    // A re-evaluation after mutating an item the pipe read, as in the
    // reactive probe, so the count is the steady-state dependency set.
    state.items[0].value += 1;
    void result.value;
    let count = 0;
    for (let link = result.deps; link !== undefined; link = link.nextDep) {
      count += 1;
    }
    row.dependencies[shape] = count;
  }
  rows.push(row);
}
const main = rows[0].dependencies;
for (const row of rows) {
  row.matchesMain = Object.fromEntries(
    Object.keys(SHAPES).map((shape) => [
      shape,
      row.dependencies[shape] === main[shape],
    ]),
  );
}

mkdirSync(path.dirname(mdFile), { recursive: true });
writeFileSync(
  path.join(PERF_DIR, "results", `${values.name}.json`),
  `${JSON.stringify({ node: process.version, shapes: Object.keys(SHAPES), rows }, undefined, 2)}\n`,
);
const labels = Object.keys(SHAPES);
const lines = [
  "# Vue tracked dependencies per pipe shape",
  "",
  "Dependencies of a Vue `computed` (production build) over a reactive array of 1,000 observable items, after one re-evaluation. `*` = differs from main.",
  "",
  `| copy | ${labels.join(" | ")} |`,
  `| --- | ${labels.map(() => "---").join(" | ")} |`,
  ...rows.map(
    (row) =>
      `| ${row.copy} | ${labels.map((label) => `${row.dependencies[label]}${row.matchesMain[label] ? "" : " *"}`).join(" | ")} |`,
  ),
];
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(
  `${lines.join("\n")}\n\n[vue-shapes] written to ${mdFile}\n`,
);
