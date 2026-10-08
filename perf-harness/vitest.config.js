import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const PERF_DIR = path.dirname(fileURLToPath(import.meta.url));

// Extra flags for the worker, e.g. PERF_NODE_FLAGS="--jitless" to measure the
// interpreter only. run-bench.mjs sets it from --node-flags.
const EXTRA_NODE_FLAGS = (process.env.PERF_NODE_FLAGS ?? "")
  .split(/\s+/u)
  .filter((flag) => flag !== "");

// Shared by both projects: one forked process per file (fresh JIT state per
// group), never two files at once, and `gc` exposed so every benchmark task
// starts without the previous task's garbage.
const SHARED = {
  pool: "forks",
  isolate: true,
  fileParallelism: false,
  maxWorkers: 1,
  execArgv: ["--expose-gc", ...EXTRA_NODE_FLAGS],
  server: {
    deps: {
      // With PERF_SOURCE=dist / cjs / bundle the copies' built files are
      // loaded by Node itself, the way an application would load them,
      // instead of going through vitest's module transform.
      external: [
        /\/libs\/[^/]+\/packages\/remeda\/dist\//u,
        /\/libs\/[^/]+\/bundle\//u,
      ],
    },
  },
};

export default defineConfig({
  root: PERF_DIR,
  cacheDir: path.join(PERF_DIR, ".vite-cache"),
  test: {
    projects: [
      {
        root: PERF_DIR,
        cacheDir: path.join(PERF_DIR, ".vite-cache"),
        test: {
          ...SHARED,
          name: "bench",
          include: [],
          setupFiles: ["./harness/setup.js"],
          benchmark: { include: ["bench/*.bench.js"] },
        },
      },
      {
        root: PERF_DIR,
        cacheDir: path.join(PERF_DIR, ".vite-cache"),
        test: {
          ...SHARED,
          name: "validate",
          include: ["validate/*.test.js"],
          testTimeout: 600_000,
        },
      },
    ],
  },
});
