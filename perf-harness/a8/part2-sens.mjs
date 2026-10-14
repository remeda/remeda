// Part 2 sensitivity: tier verdicts with the floors of the clean rotations (r1, r2) only.
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  TIERS,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  fmt,
} from "./lib.mjs";
const R = path.join(PERF, "results/a8");
const runs = loadRuns(
  readdirSync(R)
    .filter((f) => /^screen-(g8-)?r\d\.json$/u.test(f))
    .sort()
    .map((f) => path.join(R, f)),
);
const scenarios = buildScenarios(runs);
const cleanFloors = floorsOf(scenarios, (run) => !/-r0$/u.test(run.name));
console.log(
  "floors r1-r2:",
  TIERS.map((t) => fmt(cleanFloors[t]?.p95)).join("/"),
);
const out = {
  floors: Object.fromEntries(TIERS.map((t) => [t, cleanFloors[t]?.p95])),
  compare: {},
};
for (const [label, cand, ref] of [
  ["comboA_main", "branch-v-combo-a", "main"],
  ["comboB_main", "branch-v-combo-b", "main"],
  ["comboB_comboA", "branch-v-combo-b", "branch-v-combo-a"],
  ["comboA_comboB", "branch-v-combo-a", "branch-v-combo-b"],
  ["comboA_branch", "branch-v-combo-a", "branch"],
  ["comboB_branch", "branch-v-combo-b", "branch"],
  ["branch_main", "branch", "main"],
]) {
  const ev = scenarios
    .map((s) => evaluate(s, cand, ref, cleanFloors))
    .filter(Boolean);
  const bars = ev.filter((e) => e.bar);
  out.compare[label] = bars.map((e) => ({
    key: e.key,
    tier: e.tier,
    median: e.median,
    cf: e.candidateFirst,
    rf: e.referenceFirst,
    runs: e.rows.map((r) => r.ratio),
  }));
  console.log(`== ${label}: ${bars.length} bar violations`);
  for (const e of bars)
    console.log(
      `   T${e.tier} ${e.key} ${fmt(e.median)} (${fmt(e.candidateFirst)}/${fmt(e.referenceFirst)}) runs ${e.rows.map((r) => fmt(r.ratio)).join(",")}`,
    );
}
writeFileSync(
  path.join(PERF, "a8/part2-sens.json"),
  `${JSON.stringify(out, undefined, 1)}\n`,
);
