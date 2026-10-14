// Sensitivity: variant vs branch bar violations with per-batch floors instead of pooled ones.
import { readdirSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  fmt,
} from "./lib.mjs";
const R = path.join(PERF, "results/main");
const files = readdirSync(R)
  .filter((f) => /^vb-b\d-r\d\.json$/u.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
const batchOf = (run) => run.name.match(/vb-(b\d)-/u)[1];
for (const b of [...new Set(runs.map(batchOf))]) {
  const filter = (run) => batchOf(run) === b;
  const floors = floorsOf(scenarios, filter);
  const copies = runs
    .find(filter)
    .order.filter((c) => c.startsWith("branch-v-"));
  for (const copy of copies) {
    const ev = scenarios
      .map((s) => evaluate(s, copy, "branch", floors, filter))
      .filter(Boolean);
    const bars = ev.filter((e) => e.bar);
    const evm = scenarios
      .map((s) => evaluate(s, copy, "main", floors, filter))
      .filter(Boolean);
    const bm = new Map(
      scenarios
        .map((s) => [s.key, evaluate(s, "branch", "main", floors, filter)])
        .filter(([, e]) => e),
    );
    const newm = evm.filter((e) => e.bar && !bm.get(e.key)?.bar);
    console.log(
      b,
      copy.replace("branch-v-", "").padEnd(30),
      `floors ${[1, 2, 3].map((t) => fmt(floors[t]?.p95)).join("/")}`,
      `vsBranch bars: ${bars.map((e) => `T${e.tier} ${e.key.replace(/ \| (headline|data-first-guard).*$/u, "")} ${fmt(e.median)}`).join("; ") || "none"}`,
      `| new vs main: ${newm.map((e) => `T${e.tier} ${e.key.replace(/ \| (headline|data-first-guard).*$/u, "")} ${fmt(e.median)}`).join("; ") || "none"}`,
    );
  }
}
