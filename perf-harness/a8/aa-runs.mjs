import { readdirSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  loadRuns,
  buildScenarios,
  ratiosOf,
  noiseFloor,
  fmt,
} from "./lib.mjs";
const R = path.join(PERF, "results/main");
const re = new RegExp(process.argv[2] ?? "^vb-b\\d-r\\d\\.json$", "u");
const files = readdirSync(R)
  .filter((f) => re.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
for (const run of runs) {
  const parts = [];
  for (const tier of [1, 2, 3]) {
    const r = scenarios
      .filter((s) => s.tier === tier)
      .flatMap((s) =>
        ratiosOf(s, "main-aa", "main", (x) => x === run).map((x) => x.ratio),
      );
    const f = noiseFloor(r);
    parts.push(
      `T${tier} n=${f?.n} med=${fmt(f?.median)} p95=${fmt(f?.p95)} max=${fmt(f?.max)}`,
    );
  }
  // Also the signed geomean of aa/main per run (systematic offset?)
  const all = scenarios.flatMap((s) =>
    ratiosOf(s, "main-aa", "main", (x) => x === run).map((x) => x.ratio),
  );
  const gm = Math.exp(all.reduce((a, v) => a + Math.log(v), 0) / all.length);
  console.log(
    run.name.padEnd(18),
    `mainPos=${run.order.indexOf("main")} aaPos=${run.order.indexOf("main-aa")}`,
    parts.join(" | "),
    `aa gm=${fmt(gm, 4)}`,
    `load=${run.meta.loadAverage?.map((v) => v.toFixed(2)).join(",")}`,
  );
}
