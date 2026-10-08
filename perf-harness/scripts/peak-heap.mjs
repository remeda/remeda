// Peak live heap of the G1 and G10 pipe shapes at size L (100,000 items),
// per copy, over the built dists.
//
//   node --expose-gc scripts/peak-heap.mjs [--name peak]
//     [--copies main,branch,main-aa] [--groups G1,G10] [--ids <regex>]
//
// Per (scenario, copy): a first pass counts how often each callback runs;
// a second pass runs `gc()` and reads `heapUsed` inside the last call of every
// callback (the moment its step has seen every item, so every buffer the pipe
// keeps for it is full). Peak = the highest of those readings minus the heap
// after `gc()` before the call; retained = the heap after the call with its
// result still referenced, minus the same baseline. Callbacks are wrapped by
// harness/trace.js, which keeps their `length` (the branch's data-buffer
// decision depends on it).
//
// Writes results/<name>.json and results/<name>.md.

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
    name: { type: "string", default: "peak" },
    "if-missing": { type: "boolean", default: false },
    copies: { type: "string", default: "main,branch,main-aa" },
    groups: { type: "string", default: "G1,G10" },
    ids: { type: "string", default: "" },
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
if (typeof globalThis.gc !== "function") {
  throw new Error("run with --expose-gc");
}
const { gc } = globalThis;

Object.assign(process.env, {
  PERF_SOURCE: "dist",
  PERF_LIBS: values.copies,
  PERF_GROUPS: "",
  PERF_SIZES: "",
  PERF_IDS: "",
  PERF_TIERS: "",
  PERF_TARGETS: "",
  PERF_SUBSET: "",
  PERF_TAGS: "",
});

acquireBenchLock();

const { config } = await import("../harness/env.js");
const { buildRegistry } = await import("../harness/registry.js");
const { pollute } = await import("../harness/pollution.js");
const { CallHookRecorder, makeTracedLib } = await import("../harness/trace.js");

const groups = values.groups.split(",");
const ids = values.ids === "" ? undefined : new RegExp(values.ids, "u");
const { libs, entries } = await buildRegistry({
  libIds: config.libs,
  filter: (shape) =>
    groups.includes(shape.group) &&
    shape.size === "L" &&
    (ids === undefined || ids.test(shape.id)),
  // G10 is registered up to M; this measurement runs its shapes at L too.
  extraSizes: (definition) => (definition.group === "G10" ? ["L"] : []),
});
for (const lib of libs.values()) {
  pollute(lib);
}

const sink = { value: undefined };
const heapUsed = () => process.memoryUsage().heapUsed;

function measure(entry, copy) {
  const lib = libs.get(copy);

  const totals = new Map();
  const counter = new CallHookRecorder((key, callNumber) => {
    totals.set(key, callNumber);
  });
  entry.runEach(copy, {
    lib: makeTracedLib(lib, counter),
    beforeEach: (index) => counter.beginInput(index),
  })();

  const readings = [];
  const hooked = new CallHookRecorder((key, callNumber) => {
    if (totals.get(key) === callNumber) {
      gc();
      readings.push({ step: key, heapUsed: heapUsed() });
    }
  });
  const closure = entry.runEach(copy, {
    lib: makeTracedLib(lib, hooked),
    beforeEach: (index) => hooked.beginInput(index),
  });
  gc();
  gc();
  const baseline = heapUsed();
  sink.value = closure();
  gc();
  const retained = heapUsed() - baseline;
  sink.value = undefined;
  const steps = readings.map((reading) => ({
    step: reading.step,
    liveBytes: reading.heapUsed - baseline,
  }));
  return {
    // No callback ran (e.g. `drop` + `take`): no reading.
    peakBytes:
      steps.length === 0
        ? undefined
        : Math.max(...steps.map((step) => step.liveBytes)),
    retainedBytes: retained,
    steps,
  };
}

const kib = (bytes) => (bytes === undefined ? "-" : (bytes / 1024).toFixed(0));

const rows = [];
for (const entry of entries) {
  const row = { key: entry.key, group: entry.group, id: entry.id };
  for (const copy of config.libs) {
    row[copy] = measure(entry, copy);
  }
  rows.push(row);
  process.stdout.write(
    `[peak-heap] ${entry.key}: ${config.libs
      .map((copy) => `${copy} peak ${kib(row[copy].peakBytes)} KiB`)
      .join(", ")}\n`,
  );
}

const lines = [
  "# Peak live heap at L (100,000 items)",
  "",
  "Peak: the highest `heapUsed` read after `gc()` inside the last call of each callback, minus the heap after `gc()` before the call. Retained: the heap after the call with its result still referenced, minus the same baseline. KiB.",
  "",
  `| scenario | ${config.libs.map((copy) => `${copy} peak | ${copy} retained`).join(" | ")} | branch/main peak |`,
  `| --- | ${config.libs.map(() => "--- | ---").join(" | ")} | --- |`,
];
for (const row of rows) {
  const ratio =
    row.branch?.peakBytes !== undefined && row.main?.peakBytes > 0
      ? (row.branch.peakBytes / row.main.peakBytes).toFixed(3)
      : "-";
  lines.push(
    `| ${row.group} ${row.id} | ${config.libs
      .map(
        (copy) =>
          `${kib(row[copy].peakBytes)} | ${kib(row[copy].retainedBytes)}`,
      )
      .join(" | ")} | ${ratio} |`,
  );
}

mkdirSync(path.dirname(path.join(PERF_DIR, "results", values.name)), {
  recursive: true,
});
writeFileSync(
  path.join(PERF_DIR, "results", `${values.name}.json`),
  `${JSON.stringify({ copies: config.libs, node: process.version, rows }, undefined, 2)}\n`,
);
const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(
  `${lines.join("\n")}\n\n[peak-heap] written to ${mdFile}\n`,
);
