// p75 and mean ratios cand/ref per run for chosen entries.
import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/main");
const [re, idRe, cand, ref] = [
  new RegExp(process.argv[2], "u"),
  new RegExp(process.argv[3], "u"),
  process.argv[4],
  process.argv[5] ?? "branch",
];
const files = readdirSync(R)
  .filter((f) => re.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
for (const s of buildScenarios(runs).filter((x) => idRe.test(x.key))) {
  const rows = ratiosOf(s, cand, ref);
  if (!rows.length) continue;
  console.log(
    s.key.padEnd(56),
    s.metric,
    "p75:",
    rows.map((r) => fmt(r.p75)).join(","),
    " mean:",
    rows.map((r) => fmt(r.mean)).join(","),
    " candFirst:",
    rows.map((r) => (r.candidateFirst ? "y" : "n")).join(""),
  );
}
