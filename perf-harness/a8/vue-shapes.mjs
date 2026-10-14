// Vue dependency counts for more pipe shapes than scripts/reactive.mjs covers:
// a lone lazy step in `pipe`, a data-first lazy utility, and the probe's fused
// run, over a reactive array of 1,000 observable items. Counts only (no
// timings), so it runs anywhere.
//   node a8/vue-shapes.mjs main,branch,branch-v-combo-a,...
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PERF } from "./lib.mjs";

const vue = createRequire(path.join(PERF, "probes", "package.json"))(
  "@vue/reactivity",
);
const copies = process.argv[2].split(",");
const SHAPES = {
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
      path.join(PERF, "libs", copy, "packages", "remeda", "dist", "index.js"),
    ).href
  );
  const row = { copy };
  for (const [label, make] of Object.entries(SHAPES)) {
    const run = make(lib);
    const state = vue.reactive({ items: makeItems() });
    const result = vue.computed(() => run(state.items));
    void result.value;
    state.items[0].value += 1;
    void result.value;
    let count = 0;
    for (let link = result.deps; link !== undefined; link = link.nextDep)
      count += 1;
    row[label] = count;
  }
  rows.push(row);
}
const labels = Object.keys(SHAPES);
console.log(`| copy | ${labels.join(" | ")} |`);
console.log(`| --- | ${labels.map(() => "---").join(" | ")} |`);
for (const row of rows)
  console.log(
    `| ${row.copy} | ${labels.map((label) => row[label]).join(" | ")} |`,
  );
