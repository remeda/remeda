// A vitest-free runner: tinybench over the built copies, with the same
// registry, rotation, pollution and per-task GC as the vitest runner. It runs
// under Node and Bun alike, so the two runners (and the two runtimes) can be
// cross-checked.
//
//   node --expose-gc scripts/run-portable.mjs --name <run> [selection...]
//   runtimes/bun/node_modules/.bin/bun scripts/run-portable.mjs --name <run> ...
//
// Selection options are run-bench.mjs's: --copies, --rotation, --groups,
// --sizes, --ids, --tags, --subset, --tiers, --targets, --guard, --scale, --source
// (dist|cjs|bundle), --no-native, --pollution, --if-missing,
// --drop-unavailable. --per-process runs every copy in its own process (one
// child per copy, native with the first) and merges the results: the
// one-copy-per-process cross-check.
//
// Writes results/<name>.json in the vitest JSON shape the aggregation reads,
// plus <name>.meta.json and <name>.log.

import { spawn, spawnSync } from "node:child_process";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { acquireBenchLock } from "./lock.mjs";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SELF = fileURLToPath(import.meta.url);

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    copies: { type: "string" },
    rotation: { type: "string", default: "0" },
    groups: { type: "string", default: "" },
    sizes: { type: "string", default: "" },
    ids: { type: "string", default: "" },
    tags: { type: "string", default: "" },
    subset: { type: "string", default: "" },
    tiers: { type: "string", default: "" },
    targets: { type: "string", default: "" },
    guard: { type: "string", default: "" },
    scale: { type: "string", default: "1" },
    source: { type: "string", default: "dist" },
    pollution: { type: "string", default: "P2" },
    "no-native": { type: "boolean", default: false },
    "per-process": { type: "boolean", default: false },
    "if-missing": { type: "boolean", default: false },
    "drop-unavailable": { type: "boolean", default: false },
    // Internal: a per-process child writing a partial result.
    child: { type: "string", default: "" },
  },
});

if (
  values.name === undefined ||
  !/^[\w.-]+(?:\/[\w.-]+)?$/u.test(values.name)
) {
  throw new Error(
    "--name <run> is required ([A-Za-z0-9_.-], optionally one `dir/` prefix)",
  );
}
if (values.source === "src") {
  throw new Error("run-portable loads built copies: --source dist|cjs|bundle");
}

const isChild = values.child !== "";
const runtime =
  globalThis.Bun === undefined
    ? `node ${process.version}`
    : `bun ${globalThis.Bun.version}`;

const { BASE_COPIES, copyUsable } = await import("../harness/copies.js");

const resultsDir = path.join(PERF_DIR, "results");
const jsonFile = isChild
  ? values.child
  : path.join(resultsDir, `${values.name}.json`);
const logFile = path.join(resultsDir, `${values.name}.log`);
const metaFile = path.join(resultsDir, `${values.name}.meta.json`);
mkdirSync(path.dirname(path.join(resultsDir, `${values.name}.json`)), {
  recursive: true,
});

if (!isChild && (existsSync(jsonFile) || existsSync(metaFile))) {
  const meta = existsSync(metaFile)
    ? JSON.parse(readFileSync(metaFile, "utf8"))
    : undefined;
  if (!values["if-missing"]) {
    throw new Error(`${jsonFile} already exists; pick another --name`);
  }
  if (meta?.exitCode === 0 && existsSync(jsonFile)) {
    process.stdout.write(`[portable] ${values.name}: already done, skipped\n`);
    process.exit(0);
  }
  const stamp = new Date().toISOString().replaceAll(/[:.]/gu, "-");
  for (const file of [jsonFile, logFile, metaFile]) {
    if (existsSync(file)) {
      renameSync(file, `${file}.failed-${stamp}`);
    }
  }
}

let copies = (values.copies ?? BASE_COPIES.join(","))
  .split(",")
  .filter((id) => id !== "");
const unavailable = copies.filter((id) => !copyUsable(id));
if (unavailable.length > 0) {
  if (!values["drop-unavailable"]) {
    throw new Error(`Copies not available: ${unavailable.join(", ")}`);
  }
  copies = copies.filter((id) => !unavailable.includes(id));
}

const selection = {
  PERF_LIBS: copies.join(","),
  PERF_ROTATION: values.rotation,
  PERF_GROUPS: values.groups,
  PERF_SIZES: values.sizes,
  PERF_IDS: values.ids,
  PERF_TAGS: values.tags,
  PERF_SUBSET: values.subset,
  PERF_TIERS: values.tiers,
  PERF_TARGETS: values.targets,
  PERF_GUARD: values.guard,
  PERF_TIME_SCALE: values.scale,
  PERF_SOURCE: values.source,
  PERF_NATIVE: values["no-native"] ? "0" : "1",
  PERF_POLLUTION: values.pollution,
};
Object.assign(process.env, selection);

const { config, isSelected } = await import("../harness/env.js");
const { proofLine, fullGc, hasGc } = await import("../harness/proof.js");

if (!hasGc()) {
  throw new Error("no gc: run node with --expose-gc (Bun has Bun.gc)");
}

// --- Per-process parent ------------------------------------------------------------

if (values["per-process"] && !isChild) {
  acquireBenchLock();
  const { SCENARIOS } = await import("../harness/scenarios.js");
  const { estimateMs, formatDuration, selectShapes } =
    await import("../harness/estimate.js");
  const shapes = selectShapes(SCENARIOS, isSelected);
  const estimate = estimateMs(shapes, {
    copies: copies.length,
    native: config.native,
    timeScale: config.timeScale,
    processesPerFile: copies.length,
  });
  const log = createWriteStream(logFile);
  const say = (text) => {
    log.write(text);
    process.stdout.write(text);
  };
  say(
    `[portable] ${values.name}: one process per copy, order ${config.order.join(",")}, ${shapes.length} entries, estimate ${formatDuration(estimate)}\n`,
  );
  const started = performance.now();
  const merged = new Map();
  let exitCode = 0;
  for (const [position, copy] of config.order.entries()) {
    const partFile = path.join(resultsDir, `${values.name}.part-${copy}.json`);
    const args = [
      ...process.execArgv,
      SELF,
      "--name",
      values.name,
      "--child",
      partFile,
      "--copies",
      copy,
      "--groups",
      values.groups,
      "--sizes",
      values.sizes,
      "--ids",
      values.ids,
      "--tags",
      values.tags,
      "--subset",
      values.subset,
      "--tiers",
      values.tiers,
      "--targets",
      values.targets,
      "--guard",
      values.guard,
      "--scale",
      values.scale,
      "--source",
      values.source,
      "--pollution",
      values.pollution,
      ...(position === 0 && config.native ? [] : ["--no-native"]),
    ];
    const child = spawn(process.execPath, args, {
      cwd: PERF_DIR,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    for (const stream of [child.stdout, child.stderr]) {
      stream.on("data", (chunk) => say(chunk.toString()));
    }
    const code = await new Promise((resolve) => {
      child.on("close", resolve);
    });
    exitCode ||= code ?? 1;
    if (existsSync(partFile)) {
      for (const group of JSON.parse(readFileSync(partFile, "utf8")).files[0]
        .groups) {
        const target = merged.get(group.fullName) ?? {
          fullName: group.fullName,
          benchmarks: [],
        };
        target.benchmarks.push(...group.benchmarks);
        merged.set(group.fullName, target);
      }
      rmSync(partFile);
    }
  }
  writeFileSync(
    jsonFile,
    `${JSON.stringify({ files: [{ filepath: "portable", groups: [...merged.values()] }] }, undefined, 2)}\n`,
  );
  writeMeta({
    exitCode,
    wallMs: performance.now() - started,
    estimateMs: estimate,
    perProcess: true,
  });
  log.end();
  process.stdout.write(
    `[portable] ${values.name}: exit ${exitCode}, wall ${((performance.now() - started) / 1000).toFixed(1)}s\n`,
  );
  process.exit(exitCode);
}

function writeMeta(extra) {
  writeFileSync(
    metaFile,
    `${JSON.stringify(
      {
        name: values.name,
        runner: "portable",
        runtime,
        node: runtime,
        copies,
        rotation: config.rotation,
        order: config.order,
        libs: config.order,
        groups: config.groups,
        sizes: values.sizes === "" ? "all" : values.sizes.split(","),
        subset: values.subset === "" ? undefined : values.subset,
        tiers:
          values.tiers === "" ? undefined : values.tiers.split(",").map(Number),
        targets: values.targets === "" ? undefined : values.targets.split(","),
        guard: values.guard === "" ? undefined : values.guard,
        nodeFlags: process.execArgv.filter((flag) => flag !== "--expose-gc"),
        timeScale: config.timeScale,
        source: config.source,
        pollution: config.pollution,
        native: config.native,
        cpu: os.cpus()[0]?.model,
        loadAverage: os.loadavg(),
        power: spawnSync("pmset", ["-g", "batt"], { encoding: "utf8" })
          .stdout?.trim()
          .split("\n")
          .join(" | "),
        ...extra,
        wallMs: Math.round(extra.wallMs),
      },
      undefined,
      2,
    )}\n`,
  );
}

// --- Measuring process ------------------------------------------------------------

if (!isChild) {
  acquireBenchLock();
}

const { Bench } = await import("tinybench");
const { describeLoader, detectProtocol } = await import("../harness/libs.js");
const { pollute, ROUNDS } = await import("../harness/pollution.js");
const { buildRegistry } = await import("../harness/registry.js");

const log = isChild ? undefined : createWriteStream(logFile);
const say = (text) => {
  log?.write(text);
  process.stdout.write(text);
};

const started = performance.now();
const { libs, entries } = await buildRegistry({ libIds: config.order });
const pollutionStarted = performance.now();
for (const [id, lib] of libs) {
  pollute(lib, config.pollution);
  fullGc();
  if (detectProtocol(lib) === "unknown") {
    throw new Error(`Lib ${id} is broken after pollution`);
  }
}
say(
  `${proofLine({
    runner: "portable",
    order: config.order,
    source: config.source,
    loaders: [...libs.values()].map(describeLoader),
    pollution: `${config.pollution}${config.pollution === "P0" ? "" : ` (${ROUNDS} rounds)`}`,
    pollutionMs: performance.now() - pollutionStarted,
  })}\n`,
);

const sink = { value: undefined };
const gcHook = () => {
  fullGc();
};

async function measure(name, measured, entry) {
  const bench = new Bench({
    time: entry.timeMs,
    warmupTime: entry.warmupMs,
    setup: gcHook,
  });
  bench.add(name, () => {
    sink.value = measured();
  });
  await bench.warmup();
  await bench.run();
  const [task] = bench.tasks;
  if (task.result?.error !== undefined) {
    throw task.result.error;
  }
  const result = task.result;
  return {
    name,
    p75: result.p75,
    mean: result.mean,
    min: result.min,
    max: result.max,
    rme: result.rme,
    sampleCount: result.samples.length,
  };
}

const groups = [];
for (const entry of entries) {
  const benchmarks = [];
  for (const copy of config.order) {
    benchmarks.push(await measure(copy, entry.run(copy), entry));
  }
  if (config.native && entry.native !== undefined) {
    benchmarks.push(await measure("native", entry.native(), entry));
  }
  groups.push({ fullName: `portable > ${entry.key}`, benchmarks });
  say(
    `[portable] ${entry.key}: ${benchmarks
      .map(
        (benchmark) =>
          `${benchmark.name} p75 ${(benchmark.p75 * 1000).toFixed(2)}us`,
      )
      .join(", ")}\n`,
  );
}

writeFileSync(
  jsonFile,
  `${JSON.stringify({ files: [{ filepath: "portable", groups }] }, undefined, 2)}\n`,
);
if (!isChild) {
  writeMeta({ exitCode: 0, wallMs: performance.now() - started });
  say(
    `[portable] ${values.name}: ${groups.length} entries, wall ${((performance.now() - started) / 1000).toFixed(1)}s\n`,
  );
  log.end();
}
