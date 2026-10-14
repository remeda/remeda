// Reactive-store probes: how each copy's pipe behaves inside a Vue `computed`
// and a MobX `autorun` (scripts/reactive-worker.mjs, using the packages under
// probes/node_modules).
//
//   node scripts/reactive.mjs [--name reactive] [--copies main,branch,main-aa]
//     [--runs 3]
//
// Every run spawns a production-mode process (timings, tracked dependencies
// from the reactions themselves, heap growth) and a development-mode process
// (Vue's `onTrack` events), each with the copies in a rotated order. Reports
// the median across runs.
//
// Writes results/<name>.json and results/<name>.md.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { acquireBenchLock } from "./lock.mjs";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const { values } = parseArgs({
  options: {
    name: { type: "string", default: "reactive" },
    "if-missing": { type: "boolean", default: false },
    copies: { type: "string", default: "main,branch,main-aa" },
    runs: { type: "string", default: "3" },
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

const { rotate } = await import("../harness/copies.js");
const { distribution } = await import("../harness/verdicts.js");

acquireBenchLock();

const copies = values.copies.split(",");
const worker = path.join(PERF_DIR, "scripts", "reactive-worker.mjs");
const all = [];
let node;
for (let run = 0; run < Number(values.runs); run++) {
  for (const mode of ["prod", "dev"]) {
    const result = spawnSync(
      process.execPath,
      [
        "--expose-gc",
        "--no-flush-bytecode",
        worker,
        rotate(copies, run).join(","),
        mode,
      ],
      {
        cwd: PERF_DIR,
        encoding: "utf8",
        env: {
          ...process.env,
          NODE_ENV: mode === "prod" ? "production" : "development",
        },
      },
    );
    if (result.status !== 0) {
      throw new Error(`reactive worker (${mode}) failed: ${result.stderr}`);
    }
    const parsed = JSON.parse(result.stdout.trim().split("\n").at(-1));
    node = parsed.node;
    all.push(...parsed.results.map((row) => ({ ...row, run })));
  }
}

const median = (list) => distribution(list)?.median;
const rows = [];
for (const framework of ["vue", "mobx"]) {
  for (const copy of copies) {
    const prod = all.filter(
      (row) =>
        row.framework === framework && row.copy === copy && row.mode === "prod",
    );
    const dev = all.filter(
      (row) =>
        row.framework === framework && row.copy === copy && row.mode === "dev",
    );
    rows.push({
      framework,
      copy,
      medianUs: median(prod.map((row) => row.medianUs)),
      p75Us: median(prod.map((row) => row.p75Us)),
      meanUs: median(prod.map((row) => row.meanUs)),
      dependencies: median(prod.map((row) => row.dependencies)),
      // Vue's dependency links carry their key in both builds; MobX names it
      // only in dev.
      dependenciesOnControlKey: median(
        (framework === "vue" ? prod : dev).map(
          (row) => row.dependenciesOnControlKey,
        ),
      ),
      absentKeyDependencies: median(
        prod.map((row) => row.absentKeyDependencies),
      ),
      onTrackEvents: median(dev.map((row) => row.onTrackEvents)),
      onTrackControlKey: median(dev.map((row) => row.onTrackControlKey)),
      footprintKiB: median(prod.map((row) => row.footprintBytes / 1024)),
      heapGrowthKiB: median(prod.map((row) => row.heapGrowthBytes / 1024)),
    });
  }
}

const format = (value, digits = 1) =>
  value === undefined ? "-" : value.toFixed(digits);
const lines = [
  `# Reactive-store probes (node ${node}, ${values.runs} runs, medians)`,
  "",
  "`pipe(items, filter(active), map(value * 2), take(10))` over 1,000 observable items, inside a Vue `computed` and a MobX `autorun`. Re-evaluation: mutate an item the pipe read, then read the result (Vue) / let the autorun rerun (MobX), 1,000 times after 200 warmup. Dependencies: the reaction's tracked dependencies after a re-evaluation (Vue: the computed's dependency links; MobX: `getDependencyTree`), how many are on the branch's control key `$$remedaLazyRef` (Vue: the link's key; MobX: dev-build names), and MobX dependencies on keys observed while absent (`in` misses, named `...?`). onTrack: Vue's dev-build events in one re-evaluation. Footprint: heap held after `gc()` by the store and reaction after the first evaluation. Growth: heap change over the 1,200 re-evaluations that follow (a leak check).",
  "",
  "| framework | copy | re-eval median us | p75 us | mean us | dependencies | on $$remedaLazyRef | on absent keys | onTrack events | onTrack on $$remedaLazyRef | footprint KiB | growth over 1,200 re-evals KiB |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map(
    (row) =>
      `| ${row.framework} | ${row.copy} | ${format(row.medianUs, 2)} | ${format(row.p75Us, 2)} | ${format(row.meanUs, 2)} | ` +
      `${format(row.dependencies, 0)} | ${format(row.dependenciesOnControlKey, 0)} | ${format(row.absentKeyDependencies, 0)} | ${format(row.onTrackEvents, 0)} | ` +
      `${format(row.onTrackControlKey, 0)} | ${format(row.footprintKiB)} | ${format(row.heapGrowthKiB)} |`,
  ),
];

mkdirSync(path.dirname(path.join(PERF_DIR, "results", values.name)), {
  recursive: true,
});
writeFileSync(
  path.join(PERF_DIR, "results", `${values.name}.json`),
  `${JSON.stringify({ node, runs: Number(values.runs), rows, samples: all }, undefined, 2)}\n`,
);
const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(
  `${lines.join("\n")}\n\n[reactive] written to ${mdFile}\n`,
);
