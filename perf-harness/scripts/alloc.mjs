// Allocation comparison against main over the built dists (plain Node, no
// vitest). Needs scripts/build-dist.mjs to have run.
//
//   node scripts/alloc.mjs [--name alloc] [--copies main,branch] [--scale 1]
//     [--if-missing]
//
// The first copy of --copies must be main (the reference).
//
// Runs two separate processes, one at a time:
//   bytes  --expose-gc with a fixed 512MB semi-space, so N calls fit into one
//          GC-free window;
//   gc     --expose-gc with default heap flags, so the 2s steady loop sees the
//          GC behavior an application would.
// Writes results/<name>.bytes.json, results/<name>.gc.json and
// results/<name>.md.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
    name: { type: "string", default: "alloc" },
    scale: { type: "string", default: "1" },
    copies: { type: "string", default: "main,branch" },
    "if-missing": { type: "boolean", default: false },
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

const COPIES = values.copies.split(",").filter((id) => id !== "");
if (COPIES[0] !== "main" || COPIES.length < 2) {
  throw new Error(
    "--copies must start with main and name at least one more copy",
  );
}
const OTHERS = COPIES.slice(1);

acquireBenchLock();

mkdirSync(path.dirname(path.join(PERF_DIR, "results", values.name)), {
  recursive: true,
});

const worker = path.join(PERF_DIR, "scripts", "alloc-worker.mjs");
const environment = {
  ...process.env,
  PERF_SOURCE: "dist",
  PERF_LIBS: COPIES.join(","),
  PERF_TIME_SCALE: values.scale,
};

const MODES = {
  bytes: [
    "--expose-gc",
    "--min-semi-space-size=512",
    "--max-semi-space-size=512",
  ],
  gc: ["--expose-gc"],
};

const outputs = {};
for (const [mode, flags] of Object.entries(MODES)) {
  const outFile = path.join(PERF_DIR, "results", `${values.name}.${mode}.json`);
  const started = performance.now();
  const result = spawnSync(
    process.execPath,
    [...flags, worker, mode, outFile],
    {
      cwd: PERF_DIR,
      env: environment,
      stdio: "inherit",
    },
  );
  if (result.status !== 0) {
    throw new Error(`alloc worker (${mode}) failed with exit ${result.status}`);
  }
  process.stdout.write(
    `[alloc] ${mode} pass took ${((performance.now() - started) / 1000).toFixed(1)}s\n`,
  );
  outputs[mode] = JSON.parse(readFileSync(outFile, "utf8"));
}

function formatBytes(bytes) {
  if (bytes === undefined) {
    return "-";
  }
  if (Math.abs(bytes) >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
  }
  if (Math.abs(bytes) >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`;
  }
  return `${bytes.toFixed(0)} B`;
}

const lines = [
  `# Allocation: ${OTHERS.join(", ")} vs main (dist, plain node)`,
  "",
];
lines.push(
  "Bytes per call: median of 3 GC-free windows (gc(), used_heap_size delta over N calls / N). " +
    "Per-item divides by the input items per call (XS = 256 x 0/1/3, S = 64 x 16, C = 64 x 100). GC: GCProfiler over a 2s steady loop with default heap flags.",
  "",
);
const perThousand = (stats) =>
  stats === undefined
    ? "-"
    : `${((stats.gcCount / stats.calls) * 1000).toFixed(2)} (${((stats.gcMs / stats.calls) * 1000).toFixed(2)} ms)`;
const header = [
  "scenario",
  "size",
  "main B/call",
  ...OTHERS.flatMap((id) => [`${id} B/call`, `${id}/main`]),
  "GC-free",
  ...COPIES.map((id) => `${id} GCs (ms) / 1k calls`),
];
lines.push(
  `| ${header.join(" | ")} |`,
  `| ${header.map(() => "---").join(" | ")} |`,
);
for (const row of outputs.bytes.results) {
  const gcRow = outputs.gc.results.find(
    (candidate) => candidate.key === row.key,
  );
  const cells = [
    `${row.group} ${row.id}`,
    row.size,
    formatBytes(row.main.bytesPerCall),
    ...OTHERS.flatMap((id) => {
      const ratio = row[id].bytesPerCall / row.main.bytesPerCall;
      return [
        formatBytes(row[id].bytesPerCall),
        Number.isFinite(ratio) ? ratio.toFixed(3) : "-",
      ];
    }),
    COPIES.some((id) => row[id].gcInWindow) ? "NO" : "yes",
    ...COPIES.map((id) => perThousand(gcRow?.[id])),
  ];
  lines.push(`| ${cells.join(" | ")} |`);
}
lines.push("", "Steady loop totals (2s per entry):", "");
const totalsHeader = [
  "scenario",
  "size",
  ...COPIES.flatMap((id) => [`${id} calls`, `${id} GCs`, `${id} GC ms`]),
];
lines.push(
  `| ${totalsHeader.join(" | ")} |`,
  `| ${totalsHeader.map(() => "---").join(" | ")} |`,
);
for (const row of outputs.gc.results) {
  const cells = [
    `${row.group} ${row.id}`,
    row.size,
    ...COPIES.flatMap((id) => [
      String(row[id].calls),
      String(row[id].gcCount),
      row[id].gcMs.toFixed(1),
    ]),
  ];
  lines.push(`| ${cells.join(" | ")} |`);
}
lines.push("", "Calibration (bytes mode):", "");
for (const [name, stats] of Object.entries(outputs.bytes.calibration)) {
  lines.push(
    `- ${name}: ${stats.bytesPerCall.toFixed(1)} B/call (N=${stats.calls})`,
  );
}

const mdFile = path.join(PERF_DIR, "results", `${values.name}.md`);
writeFileSync(mdFile, `${lines.join("\n")}\n`);
process.stdout.write(`${lines.join("\n")}\n\n[alloc] written to ${mdFile}\n`);
