// For each G3 entry: mean copy/main ratio when the copy is in the deopt mode (arrows depth-3 x64 > 1.15) vs fast mode,
// over every (run, step-array copy) in vb-*, full, combo.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  loadRuns,
  buildScenarios,
  ratiosOf,
  fmt,
  geomean,
} from "./lib.mjs";
const R = path.join(PERF, "results/main");
const files = readdirSync(R)
  .filter((f) => /^(full-r\d-c1|combo-r\d|vb-b\d-r\d)\.json$/u.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
const modes = JSON.parse(
  readFileSync(path.join(PERF, "a8/g3-modes.json"), "utf8"),
).filter((m) => m.mode !== "" && !/on-demand|single-step|combo/u.test(m.copy));
const byRun = new Map(runs.map((r) => [r.name, r]));
for (const s of scenarios.filter((x) => x.group === "G3")) {
  const d = [],
    f = [];
  for (const m of modes) {
    const run = byRun.get(m.run);
    if (!run) continue;
    const r = ratiosOf(s, m.copy, "main", (x) => x === run)[0];
    if (!r) continue;
    (m.mode === "D" ? d : f).push(r.ratio);
  }
  console.log(
    s.key.padEnd(48),
    `T${s.tier}`,
    s.metric.padEnd(4),
    `deopt-mode gm ${fmt(geomean(d))} (n=${d.length})  fast-mode gm ${fmt(geomean(f))} (n=${f.length})`,
  );
}
