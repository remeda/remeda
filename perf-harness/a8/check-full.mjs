import { readdirSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  summarize,
  fmt,
} from "./lib.mjs";
const dir = path.join(PERF, "results/main");
const files = readdirSync(dir)
  .filter((f) => /^full-r\d-c\d\.json$/u.test(f))
  .map((f) => path.join(dir, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
const floors = floorsOf(scenarios);
console.log(
  "floors",
  Object.fromEntries(Object.entries(floors).map(([t, f]) => [t, fmt(f?.p95)])),
);
const ev = scenarios
  .map((s) => evaluate(s, "branch", "main", floors))
  .filter(Boolean);
const sum = summarize(ev);
for (const t of [1, 2, 3])
  console.log(
    t,
    sum[t].n,
    fmt(sum[t].geomean),
    JSON.stringify(sum[t].counts),
    sum[t].bar.length,
  );
