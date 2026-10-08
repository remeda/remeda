// Runs the benchmark matrix (or a subset) once under vitest and records the
// vitest JSON, the console log and a metadata sidecar under results/.
//
//   node scripts/run-bench.mjs --name <run> [--copies main,branch,main-aa]
//     [--rotation <k>] [--groups G1,G2] [--sizes S,C] [--ids <regex>]
//     [--tags headline] [--subset E|H|T1|HD|T1G] [--tiers 1,2] [--targets v1,v2]
//     [--guard <subset>]
//     [--scale 1] [--source src|dist|cjs|bundle] [--no-native]
//     [--pollution P0|P1|P2] [--node <path>] [--node-flags "--jitless"]
//     [--max-opt 1|2] [--per-process] [--if-missing] [--drop-unavailable]
//     [--skip-unless-copy <id>] [--estimate-only]
//
// Copies run in the --copies order rotated left by --rotation (default 0):
// across k = 0..n-1 every copy holds every position once. Native always runs
// last. --libs is an alias of --copies kept for older commands.
//
// --name may contain one directory level (`main/full-r0`), written under
// results/. --if-missing makes the step resumable: an existing result whose
// meta says it finished (exit 0) is kept and the run skipped; a failed one is
// moved aside and rerun.
//
// --node runs vitest (and so its forked workers) with another node binary.
// --node-flags and --max-opt reach only the vitest worker that runs the
// benchmarks (via PERF_NODE_FLAGS, read by vitest.config.js); every log's
// `[perf setup]` line prints the flags the worker really has.
//
// --per-process runs one vitest process per copy (native with the first),
// then merges the results into one file, for the one-copy-per-process
// cross-check.
//
// A lock directory guarantees that two measuring processes never overlap.

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
const VITEST = findUp(PERF_DIR, "node_modules/vitest/vitest.mjs");

function findUp(start, relative) {
  let directory = start;
  while (directory !== path.dirname(directory)) {
    const candidate = path.join(directory, relative);
    if (existsSync(candidate)) {
      return candidate;
    }
    directory = path.dirname(directory);
  }
  throw new Error(`Could not find ${relative} above ${start}`);
}

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    copies: { type: "string" },
    libs: { type: "string" },
    rotation: { type: "string", default: "0" },
    groups: { type: "string", default: "" },
    sizes: { type: "string", default: "" },
    ids: { type: "string", default: "" },
    tags: { type: "string", default: "" },
    subset: { type: "string", default: "" },
    tiers: { type: "string", default: "" },
    targets: { type: "string", default: "" },
    guard: { type: "string", default: "" },
    "node-flags": { type: "string", default: "" },
    "max-opt": { type: "string", default: "" },
    node: { type: "string", default: "" },
    scale: { type: "string", default: "1" },
    source: { type: "string", default: "src" },
    pollution: { type: "string", default: "P2" },
    "no-native": { type: "boolean", default: false },
    "per-process": { type: "boolean", default: false },
    "if-missing": { type: "boolean", default: false },
    "drop-unavailable": { type: "boolean", default: false },
    "skip-unless-copy": { type: "string", default: "" },
    "estimate-only": { type: "boolean", default: false },
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

const { BASE_COPIES, copyUsable, readCopiesStatus } =
  await import("../harness/copies.js");

if (
  values["skip-unless-copy"] !== "" &&
  !copyUsable(values["skip-unless-copy"])
) {
  process.stdout.write(
    `[run-bench] ${values.name}: skipped, copy ${values["skip-unless-copy"]} is not available ` +
      `(status ${readCopiesStatus().copies?.[values["skip-unless-copy"]]?.status ?? "absent"})\n`,
  );
  process.exit(0);
}

const resultsDir = path.join(PERF_DIR, "results");
const jsonFile = path.join(resultsDir, `${values.name}.json`);
const logFile = path.join(resultsDir, `${values.name}.log`);
const metaFile = path.join(resultsDir, `${values.name}.meta.json`);
mkdirSync(path.dirname(jsonFile), { recursive: true });

if (existsSync(jsonFile) || existsSync(metaFile)) {
  const meta = existsSync(metaFile)
    ? JSON.parse(readFileSync(metaFile, "utf8"))
    : undefined;
  if (!values["if-missing"]) {
    throw new Error(`${jsonFile} already exists; pick another --name`);
  }
  if (meta?.exitCode === 0 && existsSync(jsonFile)) {
    process.stdout.write(`[run-bench] ${values.name}: already done, skipped\n`);
    process.exit(0);
  }
  const stamp = new Date().toISOString().replaceAll(/[:.]/gu, "-");
  for (const file of [jsonFile, logFile, metaFile]) {
    if (existsSync(file)) {
      renameSync(file, `${file}.failed-${stamp}`);
    }
  }
  process.stdout.write(
    `[run-bench] ${values.name}: an unfinished earlier attempt was moved aside (*.failed-${stamp})\n`,
  );
}

// --- Copies -------------------------------------------------------------------

let copies = (values.copies ?? values.libs ?? BASE_COPIES.join(","))
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id !== "");
const unavailable = copies.filter((id) => !copyUsable(id));
if (unavailable.length > 0) {
  if (!values["drop-unavailable"]) {
    throw new Error(
      `Copies not available: ${unavailable.join(", ")} (see libs/COPIES.json, or pass --drop-unavailable)`,
    );
  }
  process.stdout.write(
    `[run-bench] dropping unavailable copies: ${unavailable.join(", ")}\n`,
  );
  copies = copies.filter((id) => !unavailable.includes(id));
}

// --- Node binary and flags ---------------------------------------------------------

const nodeBinary =
  values.node === "" ? process.execPath : path.resolve(PERF_DIR, values.node);
const nodeVersion = spawnSync(nodeBinary, ["--version"], {
  encoding: "utf8",
}).stdout?.trim();
if (nodeVersion === undefined || nodeVersion === "") {
  throw new Error(`--node ${nodeBinary} did not run`);
}
const nodeFlags = values["node-flags"]
  .split(/\s+/u)
  .filter((flag) => flag !== "");
if (values["max-opt"] !== "") {
  const v8Options = spawnSync(nodeBinary, ["--v8-options"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).stdout;
  if (!/^\s*--max-opt\b/mu.test(v8Options)) {
    throw new Error(`${nodeBinary} (${nodeVersion}) has no --max-opt flag`);
  }
  nodeFlags.push(`--max-opt=${values["max-opt"]}`);
}

// --- Selection ---------------------------------------------------------------------

const rotation = Number(values.rotation);
const selection = {
  PERF_LIBS: copies.join(","),
  PERF_ROTATION: String(rotation),
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
  PERF_NODE_FLAGS: nodeFlags.join(" "),
};

// Resolve the selection against the scenario definitions here, with the same
// code the workers use, so files without a selected scenario are skipped
// (vitest fails a bench file that declares nothing).
Object.assign(process.env, selection);
const { config, isSelected, KNOWN_GROUPS } = await import("../harness/env.js");
const { SCENARIOS } = await import("../harness/scenarios.js");
const { estimateMs, formatDuration, selectShapes } =
  await import("../harness/estimate.js");
const shapes = selectShapes(SCENARIOS, isSelected);
const selectedCounts = new Map();
for (const shape of shapes) {
  selectedCounts.set(shape.group, (selectedCounts.get(shape.group) ?? 0) + 1);
}
const groups = KNOWN_GROUPS.filter((group) => selectedCounts.has(group));
if (groups.length === 0) {
  throw new Error("The selection matches no scenario");
}
const estimate = estimateMs(shapes, {
  copies: copies.length,
  native: config.native,
  timeScale: config.timeScale,
  processesPerFile: values["per-process"] ? copies.length : 1,
});
process.stdout.write(
  `[run-bench] ${values.name}: order ${config.order.join(",")}${config.native ? ",native" : ""} ` +
    `source=${config.source} pollution=${config.pollution} node=${nodeVersion} flags=[${nodeFlags.join(" ")}] ` +
    `selected ${shapes.length}: ${groups.map((group) => `${group}=${selectedCounts.get(group)}`).join(" ")}; ` +
    `estimate ${formatDuration(estimate)}\n`,
);
if (values["estimate-only"]) {
  process.exit(0);
}

acquireBenchLock();

// --- Run ---------------------------------------------------------------------------

function runVitest(environment, outputJson, log) {
  const args = [
    VITEST,
    "bench",
    "--run",
    "--config",
    path.join(PERF_DIR, "vitest.config.js"),
    "--project",
    "bench",
    "--reporter=default",
    "--outputJson",
    outputJson,
    ...groups.map((group) => `bench/${group}.bench.js`),
  ];
  const child = spawn(nodeBinary, args, {
    cwd: PERF_DIR,
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
  });
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", (chunk) => {
      log.write(chunk);
      process.stdout.write(chunk);
    });
  }
  return new Promise((resolve) => {
    child.on("close", resolve);
  });
}

const log = createWriteStream(logFile);
const startedAt = new Date();
const started = performance.now();
let exitCode;
const baseEnvironment = { ...process.env, ...selection };

if (values["per-process"]) {
  // One process per copy, in rotated order; native runs with the first one.
  const merged = new Map();
  exitCode = 0;
  for (const [position, copy] of config.order.entries()) {
    const partFile = `${jsonFile}.part-${copy}`;
    const code = await runVitest(
      {
        ...baseEnvironment,
        PERF_LIBS: copy,
        PERF_ROTATION: "0",
        PERF_NATIVE: position === 0 && config.native ? "1" : "0",
      },
      partFile,
      log,
    );
    exitCode ||= code ?? 1;
    if (!existsSync(partFile)) {
      continue;
    }
    for (const file of JSON.parse(readFileSync(partFile, "utf8")).files) {
      for (const group of file.groups) {
        const key = group.fullName.split(" > ").at(-1);
        const target = merged.get(key) ?? {
          fullName: group.fullName,
          benchmarks: [],
        };
        target.benchmarks.push(...group.benchmarks);
        merged.set(key, target);
      }
    }
    rmSync(partFile);
  }
  writeFileSync(
    jsonFile,
    `${JSON.stringify({ files: [{ filepath: "per-process", groups: [...merged.values()] }] }, undefined, 2)}\n`,
  );
} else {
  exitCode = await runVitest(baseEnvironment, jsonFile, log);
}
const wallMs = performance.now() - started;
log.end();

writeFileSync(
  metaFile,
  `${JSON.stringify(
    {
      name: values.name,
      runner: "vitest",
      copies,
      rotation,
      order: config.order,
      // Kept for older aggregation: the entry order.
      libs: config.order,
      perProcess: values["per-process"],
      groups,
      sizes: values.sizes === "" ? "all" : values.sizes.split(","),
      ids: values.ids === "" ? undefined : values.ids,
      tags: values.tags === "" ? undefined : values.tags.split(","),
      subset: values.subset === "" ? undefined : values.subset,
      tiers:
        values.tiers === "" ? undefined : values.tiers.split(",").map(Number),
      targets: values.targets === "" ? undefined : values.targets.split(","),
      guard: values.guard === "" ? undefined : values.guard,
      nodeFlags,
      node: nodeVersion,
      nodeBinary,
      scenarioSizes: Object.fromEntries(selectedCounts),
      timeScale: Number(values.scale),
      source: values.source,
      pollution: values.pollution,
      native: !values["no-native"],
      estimateMs: Math.round(estimate),
      startedAt: startedAt.toISOString(),
      wallMs: Math.round(wallMs),
      exitCode,
      cpu: os.cpus()[0]?.model,
      loadAverage: os.loadavg(),
      // macOS only; "AC Power" vs "Battery Power" plus charge level.
      power: spawnSync("pmset", ["-g", "batt"], { encoding: "utf8" })
        .stdout?.trim()
        .split("\n")
        .join(" | "),
    },
    undefined,
    2,
  )}\n`,
);

process.stdout.write(
  `\n[run-bench] ${values.name}: exit ${exitCode}, wall ${(wallMs / 1000).toFixed(1)}s (estimate ${formatDuration(estimate)})\n` +
    `[run-bench] json: ${jsonFile}\n[run-bench] log:  ${logFile}\n`,
);
process.exitCode = exitCode ?? 1;
