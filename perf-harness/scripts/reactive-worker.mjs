// One reactive-store probe process, spawned by reactive.mjs.
//
// Usage: node --expose-gc scripts/reactive-worker.mjs <copies> <prod|dev>
//   (copies comma-separated; NODE_ENV picks Vue's and MobX's build)
//
// For every copy: a Vue `computed` and a MobX `autorun` over
// `pipe(items, filter(active), map(value * 2), take(10))` on 1,000 observable
// items. Measures the re-evaluation time after mutating an item the pipe read,
// the dependencies the reaction tracks, the heap the store and reaction hold
// after the first evaluation (footprint), and the heap growth over the 1,200
// re-evaluations that follow. Run with --no-flush-bytecode, so bytecode
// flushing can't shrink the heap between readings. Dev mode adds Vue's `onTrack` events and MobX's dependency
// names (production MobX names every dependency "ObservableObject.key").
// Prints one JSON line.

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const [copyList, mode] = process.argv.slice(2);
const copies = copyList.split(",");
if (typeof globalThis.gc !== "function") {
  throw new Error("run with --expose-gc");
}
const { gc } = globalThis;
const heapUsed = () => process.memoryUsage().heapUsed;

const requireProbe = createRequire(
  path.join(PERF_DIR, "probes", "package.json"),
);
const vue = requireProbe("@vue/reactivity");
const mobx = requireProbe("mobx");
mobx.configure({ enforceActions: "never" });

const ITEMS = 1000;
const ITERATIONS = 1000;
const WARMUP = 200;
// The pipe reads items until it has 10 active ones; mutating these dirties it.
const READ_ITEMS = Array.from({ length: 10 }, (_, index) => index * 2);

const makeItems = () =>
  Array.from({ length: ITEMS }, (_, index) => ({
    id: index,
    active: index % 2 === 0,
    value: index,
  }));

const pipeOf = (lib) => (items) =>
  lib.pipe(
    items,
    lib.filter((item) => item.active),
    lib.map((item) => item.value * 2),
    lib.take(10),
  );

function timings(list) {
  const sorted = [...list].sort((a, b) => a - b);
  const at = (q) =>
    sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  return {
    medianUs: at(0.5) * 1000,
    p75Us: at(0.75) * 1000,
    meanUs:
      (list.reduce((total, value) => total + value, 0) / list.length) * 1000,
  };
}

function vueProbe(lib) {
  const run = pipeOf(lib);
  const tracked = [];
  gc();
  const heapBefore = heapUsed();
  const state = vue.reactive({ items: makeItems() });
  const result = vue.computed(
    () => run(state.items),
    mode === "dev"
      ? {
          onTrack: (event) => {
            tracked.push(`${String(event.type)}:${String(event.key)}`);
          },
        }
      : undefined,
  );
  let sink = result.value;
  gc();
  const heapAfterFirst = heapUsed();
  const times = [];
  let onTrackPerEvaluation;
  for (let iteration = 0; iteration < WARMUP + ITERATIONS; iteration++) {
    const item = state.items[READ_ITEMS[iteration % READ_ITEMS.length]];
    tracked.length = 0;
    const started = performance.now();
    item.value += 1;
    sink = result.value;
    const elapsed = performance.now() - started;
    if (iteration >= WARMUP) {
      times.push(elapsed);
    }
    onTrackPerEvaluation ??= mode === "dev" ? [...tracked] : undefined;
  }
  gc();
  const heapAfterAll = heapUsed();

  // The computed's dependency links (Vue 3.5: `deps` -> `nextDep`).
  const keys = [];
  for (let link = result.deps; link !== undefined; link = link.nextDep) {
    keys.push(String(link.dep?.key));
  }
  return {
    ...timings(times),
    dependencies: keys.length,
    dependenciesOnControlKey: keys.filter((key) => key === "$$remedaLazyRef")
      .length,
    onTrackEvents: onTrackPerEvaluation?.length,
    onTrackControlKey: onTrackPerEvaluation?.filter((event) =>
      event.endsWith(":$$remedaLazyRef"),
    ).length,
    footprintBytes: heapAfterFirst - heapBefore,
    heapGrowthBytes: heapAfterAll - heapAfterFirst,
    sink,
  };
}

function mobxProbe(lib) {
  const run = pipeOf(lib);
  gc();
  const heapBefore = heapUsed();
  const store = mobx.observable({ items: makeItems() });
  let sink;
  const dispose = mobx.autorun(() => {
    sink = run(store.items);
  });
  gc();
  const heapAfterFirst = heapUsed();
  const times = [];
  for (let iteration = 0; iteration < WARMUP + ITERATIONS; iteration++) {
    const item = store.items[READ_ITEMS[iteration % READ_ITEMS.length]];
    const started = performance.now();
    mobx.runInAction(() => {
      item.value += 1;
    });
    const elapsed = performance.now() - started;
    if (iteration >= WARMUP) {
      times.push(elapsed);
    }
  }
  gc();
  const heapAfterAll = heapUsed();
  const tree = mobx.getDependencyTree(dispose);
  const direct = tree.dependencies ?? [];
  dispose();
  const names = direct.map((dependency) => String(dependency.name));
  return {
    ...timings(times),
    dependencies: names.length,
    // Dev names carry the key; a trailing "?" marks a key observed while
    // absent (an `in` miss), in both builds.
    dependenciesOnControlKey:
      mode === "dev"
        ? names.filter((name) => name.includes("$$remedaLazyRef")).length
        : undefined,
    absentKeyDependencies: names.filter((name) => name.endsWith("?")).length,
    footprintBytes: heapAfterFirst - heapBefore,
    heapGrowthBytes: heapAfterAll - heapAfterFirst,
    sink,
  };
}

const libs = new Map();
for (const copy of copies) {
  libs.set(
    copy,
    await import(
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
    ),
  );
}

const PROBES = [
  ["vue", vueProbe],
  ["mobx", mobxProbe],
];

// One unrecorded pass over every copy first, so the first copy measured
// doesn't also pay for the frameworks' one-time setup (code, feedback, caches)
// in its timings and heap growth.
for (const lib of libs.values()) {
  for (const [, probe] of PROBES) {
    probe(lib);
  }
}

const results = [];
for (const [copy, lib] of libs) {
  for (const [framework, probe] of PROBES) {
    const { sink, ...result } = probe(lib);
    if (!Array.isArray(sink) || sink.length !== 10) {
      throw new Error(
        `${framework} / ${copy}: unexpected result ${String(sink)}`,
      );
    }
    results.push({ framework, copy, mode, ...result });
  }
}
process.stdout.write(`${JSON.stringify({ node: process.version, results })}\n`);
