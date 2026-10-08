import { readdirSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  TIERS,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  summarize,
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
for (const [label, filter] of [
  ["all runs", () => true],
  ["r1-r2", (run) => !/-r0$/u.test(run.name)],
]) {
  const floors = floorsOf(scenarios, filter);
  const ev = scenarios
    .map((s) => evaluate(s, "main-aa", "main", floors, filter))
    .filter(Boolean);
  const sum = summarize(ev);
  const tol = TIERS.map((t) =>
    Math.max(Math.log(1.005), 2 * Math.abs(Math.log(sum[t].geomean ?? 1))),
  );
  console.log(
    label,
    "A/A weighted gm",
    TIERS.map((t) => `T${t} ${fmt(sum[t].geomean, 4)}`).join(" "),
    "tolerance",
    tol.map((x) => `${(Math.expm1(x) * 100).toFixed(2)}%`).join(" "),
  );
  for (const [c, r] of [
    ["branch-v-combo-a", "main"],
    ["branch-v-combo-b", "main"],
    ["branch-v-combo-b", "branch-v-combo-a"],
  ]) {
    const e2 = scenarios
      .map((s) => evaluate(s, c, r, floors, filter))
      .filter(Boolean);
    const s2 = summarize(e2);
    console.log(
      "  ",
      c,
      "/",
      r,
      TIERS.map(
        (t) => `T${t} ${fmt(s2[t].geomean)} bar ${s2[t].bar.length}`,
      ).join(" | "),
    );
  }
}
