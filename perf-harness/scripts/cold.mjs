// Cold start: fresh processes per copy, each importing one copy and running
// one probe 50 times without warmup (scripts/cold-worker.mjs).
//
//   node scripts/cold.mjs [--name cold] [--copies main,branch,main-aa]
//     [--runs 20] [--source dist|cjs|bundle] [--node <path>]
//
// Every (copy, probe) gets --runs processes; within each round the copies
// rotate, so no copy always starts first. Reports median and p75 across
// processes of the import time, the first call and the first 50 calls.
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
    name: { type: "string", default: "cold" },
    "if-missing": { type: "boolean", default: false },
    copies: { type: "string", default: "main,branch,main-aa" },
    runs: { type: "string", default: "20" },
    source: { type: "string", default: "dist" },
    node: { type: "string", default: "" },
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
const { distribution, quantile } = await import("../harness/verdicts.js");
const { PROBES } = await import("./cold-worker.mjs");

acquireBenchLock();

const copies = values.copies.split(",");
const runs = Number(values.runs);
const nodeBinary =
  values.node === "" ? process.execPath : path.resolve(PERF_DIR, values.node);
const worker = path.join(PERF_DIR, "scripts", "cold-worker.mjs");
const probes = Object.keys(PROBES);

const samples = [];
const started = performance.now();
for (let round = 0; round < runs; round++) {
  for (const probe of probes) {
    for (const copy of rotate(copies, round)) {
      const result = spawnSync(
        nodeBinary,
        [worker, copy, probe, values.source],
        {
          cwd: PERF_DIR,
          encoding: "utf8",
        },
      );
      if (result.status !== 0) {
        throw new Error(
          `cold worker ${copy} / ${probe} failed: ${result.stderr}`,
        );
      }
      samples.push(JSON.parse(result.stdout.trim().split("\n").at(-1)));
    }
  }
}
const nodeVersion = spawnSync(nodeBinary, ["--version"], {
  encoding: "utf8",
}).stdout.trim();

function stats(list) {
  const summary = distribution(list);
  return {
    median: summary?.median,
    p75: summary === undefined ? undefined : quantile(summary.values, 0.75),
    n: summary?.n ?? 0,
  };
}

const rows = [];
for (const probe of probes) {
  for (const copy of copies) {
    const mine = samples.filter(
      (sample) => sample.copy === copy && sample.probe === probe,
    );
    rows.push({
      probe,
      copy,
      importMs: stats(mine.map((sample) => sample.importMs)),
      firstUs: stats(mine.map((sample) => sample.firstUs)),
      first50Us: stats(mine.map((sample) => sample.first50Us)),
    });
  }
}

const format = (value, digits = 1) =>
  value === undefined ? "-" : value.toFixed(digits);
const mainRow = (probe) =>
  rows.find((row) => row.probe === probe && row.copy === "main");
const lines = [
  `# Cold start (${values.source}, node ${nodeVersion}, ${runs} processes per copy and probe)`,
  "",
  "Each process imports one copy and calls one probe 50 times with no warmup. Median / p75 across processes. Ratios are copy/main on the medians.",
  "",
  "| probe | copy | import ms | first call us | first 50 calls us | first call / main | first 50 / main |",
  "| --- | --- | --- | --- | --- | --- | --- |",
];
for (const row of rows) {
  const reference = mainRow(row.probe);
  lines.push(
    `| ${row.probe} | ${row.copy} | ${format(row.importMs.median, 2)} / ${format(row.importMs.p75, 2)} | ` +
      `${format(row.firstUs.median)} / ${format(row.firstUs.p75)} | ${format(row.first50Us.median)} / ${format(row.first50Us.p75)} | ` +
      `${reference === undefined ? "-" : format(row.firstUs.median / reference.firstUs.median, 3)} | ` +
      `${reference === undefined ? "-" : format(row.first50Us.median / reference.first50Us.median, 3)} |`,
  );
}

mkdirSync(path.dirname(path.join(PERF_DIR, "results", values.name)), {
  recursive: true,
});
writeFileSync(
  path.join(PERF_DIR, "results", `${values.name}.json`),
  `${JSON.stringify({ node: nodeVersion, source: values.source, runs, rows, samples }, undefined, 2)}\n`,
);
const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(
  `${lines.join("\n")}\n\n[cold] ${samples.length} processes in ${((performance.now() - started) / 1000).toFixed(1)}s; written to ${mdFile}\n`,
);
