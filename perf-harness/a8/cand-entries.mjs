import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/a8");
const runs = loadRuns(
  readdirSync(R)
    .filter((f) => /^cand-r\d\.json$/u.test(f))
    .sort()
    .map((f) => path.join(R, f)),
);
const re = new RegExp(process.argv[2], "u");
const B = "branch-v-cand-base";
for (const s of buildScenarios(runs, { fastRef: B }).filter((x) =>
  re.test(x.key),
)) {
  const c = (a, b) =>
    ratiosOf(s, a, b)
      .map((r) => fmt(r.ratio))
      .join(",");
  console.log(
    s.key.replace(/ \| (headline|data-first-guard).*$/u, "").padEnd(46),
    `T${s.tier}`,
    "forof/base",
    c("branch-v-cand-forof", B),
    "full/map",
    c("branch-v-cand-full", "branch-v-cand-map"),
    "map/base",
    c("branch-v-cand-map", B),
    "aa/main",
    c("main-aa", "main"),
  );
}
