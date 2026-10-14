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
const R = path.join(PERF, "results/a8");
const runs = loadRuns(
  readdirSync(R)
    .filter((f) => /^screen-(g8-)?r\d\.json$/u.test(f))
    .sort()
    .map((f) => path.join(R, f)),
);
const scenarios = buildScenarios(runs);
const filter = (run) => !/-r0$/u.test(run.name);
const floors = floorsOf(scenarios, filter);
for (const [c, r] of [
  ["branch-v-combo-a", "main"],
  ["branch-v-combo-b", "main"],
]) {
  for (const e of scenarios
    .map((s) => evaluate(s, c, r, floors, filter))
    .filter((e) => e?.bar))
    console.log(
      c,
      e.key,
      e.tier,
      fmt(e.median),
      fmt(e.candidateFirst),
      fmt(e.referenceFirst),
      e.rows.map((x) => `${x.run.split("/")[1]}:${fmt(x.ratio)}`).join(" "),
    );
}
