// Per entry in the screen: every copy / main, and B/A, per run.
import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/a8");
const runs = loadRuns(
  readdirSync(R)
    .filter((f) => /^screen-(g8-)?r\d\.json$/u.test(f))
    .sort()
    .map((f) => path.join(R, f)),
);
const idRe = new RegExp(process.argv[2], "u");
const A = "branch-v-combo-a",
  B = "branch-v-combo-b";
for (const s of buildScenarios(runs).filter((x) => idRe.test(x.key))) {
  const cell = (c, ref) =>
    ratiosOf(s, c, ref)
      .map((r) => fmt(r.ratio))
      .join(",");
  console.log(
    s.key.replace(/ \| (headline|data-first-guard).*$/u, "").padEnd(52),
    `T${s.tier}`,
    `A/main ${cell(A, "main")}`,
    `B/main ${cell(B, "main")}`,
    `br/main ${cell("branch", "main")}`,
    `B/A ${cell(B, A)}`,
    `aa/main ${cell("main-aa", "main")}`,
  );
}
