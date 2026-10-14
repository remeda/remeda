// One allocation-measurement process; spawned by alloc.mjs, which picks the
// V8 flags for each mode.
//
//   bytes  bytes allocated per call: gc(), read used_heap_size, run the closure
//          N times, read it again. The window must see no GC (checked with a
//          PerformanceObserver on `gc` entries and cross-checked with
//          v8.GCProfiler); if one happens, retry with N halved. Run with a
//          large fixed semi-space so the windows fit.
//   gc     GC count and total GC time over a fixed 2s steady loop, default heap
//          flags.
//
// Usage: node --expose-gc [flags] scripts/alloc-worker.mjs <bytes|gc> <out.json>

import { writeFileSync } from "node:fs";
import { PerformanceObserver } from "node:perf_hooks";
import v8 from "node:v8";
import { config } from "../harness/env.js";
import { itemsPerCall } from "../harness/fixtures.js";
import { pollute } from "../harness/pollution.js";
import { buildRegistry } from "../harness/registry.js";

const [mode, outFile] = process.argv.slice(2);
if ((mode !== "bytes" && mode !== "gc") || outFile === undefined) {
  throw new Error("usage: alloc-worker.mjs <bytes|gc> <out.json>");
}
if (typeof globalThis.gc !== "function") {
  throw new Error("run with --expose-gc");
}
const { gc } = globalThis;

export const SUBSET = [
  ["G1", "filter+map", "XS"],
  ["G1", "filter+map", "S"],
  ["G1", "filter+map", "C"],
  ["G1", "filter+map", "M"],
  ["G1", "map+filter+map", "M"],
  ["G1", "map+filter+map", "L"],
  ["G1", "flatMap+filter+map", "M"],
  ["G1", "map reading data", "M"],
  ["G2", "deep-8 primitive", "M"],
  ["G2", "deep-8 primitive", "L"],
  ["G2", "deep-8 object", "M"],
  ["G2", "deep-8 object", "L"],
  ["G5", "data-first unique", "M"],
  ["G5", "data-first map", "S"],
  ["G5", "data-first map", "C"],
  ["G10", "filter,map / sortBy / take / groupBy", "C"],
  ["G9", "map((...args) => args[0])", "C"],
];

const LIB_IDS = config.libs;

const { libs, entries } = await buildRegistry({
  libIds: LIB_IDS,
  filter: ({ group, id, size }) =>
    SUBSET.some(
      ([wantedGroup, wantedId, wantedSize]) =>
        wantedGroup === group && wantedId === id && wantedSize === size,
    ),
});
if (entries.length !== SUBSET.length) {
  throw new Error(`Subset matched ${entries.length}/${SUBSET.length} entries`);
}

for (const lib of libs.values()) {
  pollute(lib);
}

const sink = { value: undefined };

const gcEntries = [];
const observer = new PerformanceObserver((list) => {
  gcEntries.push(...list.getEntries());
});
observer.observe({ entryTypes: ["gc"] });

const flushObserver = async () => {
  // GC entries are queued from the GC callback and delivered on a later turn.
  for (let turn = 0; turn < 3; turn++) {
    await new Promise((resolve) => {
      setImmediate(resolve);
    });
  }
};

const gcEntriesBetween = (start, end) =>
  gcEntries.filter(
    (entry) => entry.startTime >= start && entry.startTime <= end,
  );

function warm(measured, budgetMs) {
  const started = performance.now();
  let calls = 0;
  while (performance.now() - started < budgetMs || calls < 20) {
    sink.value = measured();
    calls += 1;
  }
  return calls;
}

async function bytesWindow(measured, calls) {
  gc();
  gc();
  await flushObserver();
  const profiler = new v8.GCProfiler();
  profiler.start();
  const start = performance.now();
  const before = v8.getHeapStatistics().used_heap_size;
  for (let call = 0; call < calls; call++) {
    sink.value = measured();
  }
  const after = v8.getHeapStatistics().used_heap_size;
  const end = performance.now();
  const profile = profiler.stop();
  sink.value = undefined;
  await flushObserver();
  const observed = gcEntriesBetween(start, end).length;
  return {
    calls,
    bytesPerCall: (after - before) / calls,
    gcObserved: observed,
    gcProfiled: profile.statistics.length,
  };
}

// Stays well inside the 512MB semi-space the driver configures; a single main
// call at size L allocates more than 100MB.
const WINDOW_BUDGET_BYTES = 192 * 1024 * 1024;
const REPEATS = 3;

async function measureBytes(measured) {
  warm(measured, 300 * config.timeScale);
  const probe = await bytesWindow(measured, 1);
  let calls = Math.max(
    1,
    Math.min(
      2000,
      Math.floor(WINDOW_BUDGET_BYTES / Math.max(probe.bytesPerCall, 64)),
    ),
  );
  const windows = [];
  let retries = 0;
  while (windows.length < REPEATS) {
    const window = await bytesWindow(measured, calls);
    if (window.gcObserved > 0 || window.gcProfiled > 0) {
      if (calls === 1 || retries >= 8) {
        windows.push({ ...window, gcInWindow: true });
        continue;
      }
      calls = Math.max(1, Math.floor(calls / 2));
      retries += 1;
      continue;
    }
    windows.push(window);
  }
  const sorted = windows
    .map((window) => window.bytesPerCall)
    .sort((a, b) => a - b);
  return {
    bytesPerCall: sorted[Math.floor(sorted.length / 2)],
    spread: [sorted[0], sorted.at(-1)],
    calls,
    retries,
    gcInWindow: windows.some((window) => window.gcInWindow === true),
  };
}

// PERF_TIME_SCALE shortens the loop for smoke runs (alloc.mjs --scale).
const STEADY_MS = 2000 * config.timeScale;

async function measureGc(measured) {
  warm(measured, 300 * config.timeScale);
  gc();
  await flushObserver();
  const profiler = new v8.GCProfiler();
  profiler.start();
  const start = performance.now();
  let calls = 0;
  while (performance.now() - start < STEADY_MS) {
    for (let inner = 0; inner < 16; inner++) {
      sink.value = measured();
    }
    calls += 16;
  }
  const end = performance.now();
  const profile = profiler.stop();
  sink.value = undefined;
  await flushObserver();
  const observed = gcEntriesBetween(start, end);
  const byType = {};
  for (const statistic of profile.statistics) {
    byType[statistic.gcType] = (byType[statistic.gcType] ?? 0) + 1;
  }
  return {
    wallMs: end - start,
    calls,
    gcCount: profile.statistics.length,
    gcMs:
      profile.statistics.reduce(
        (total, statistic) => total + statistic.cost,
        0,
      ) / 1000,
    gcByType: byType,
    observerCount: observed.length,
    observerMs: observed.reduce((total, entry) => total + entry.duration, 0),
  };
}

const results = [];
for (const entry of entries) {
  const row = {
    key: entry.key,
    group: entry.group,
    id: entry.id,
    size: entry.size,
    itemsPerCall: itemsPerCall(entry.size),
  };
  for (const libId of LIB_IDS) {
    const measured = entry.run(libId);
    row[libId] =
      mode === "bytes"
        ? await measureBytes(measured)
        : await measureGc(measured);
  }
  results.push(row);
  process.stdout.write(`[alloc ${mode}] ${entry.key} done\n`);
}

const calibration = {};
if (mode === "bytes") {
  // Known allocations, to sanity-check the heap-delta method in this build.
  calibration.emptyClosure = await measureBytes(() => 0);
  calibration.threeFieldObject = await measureBytes(() => ({
    a: 1,
    b: 2,
    c: 3,
  }));
  calibration.array16 = await measureBytes(() => [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);
}

observer.disconnect();
writeFileSync(
  outFile,
  `${JSON.stringify(
    {
      mode,
      source: config.source,
      libs: LIB_IDS,
      execArgv: process.execArgv,
      node: process.version,
      calibration,
      results,
    },
    undefined,
    2,
  )}\n`,
);
