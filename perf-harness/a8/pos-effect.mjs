// Per run: geomean over every scenario of copy/branch for each copy (incl. main, main-aa),
// to see which copy shifts with its position.
import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/main");
const re = new RegExp(process.argv[2] ?? "^vb-b[23]-r\\d\\.json$", "u");
const ref = process.argv[3] ?? "branch";
const files = readdirSync(R)
  .filter((f) => re.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
for (const run of runs) {
  const cells = run.order.map((copy, pos) => {
    if (copy === ref)
      return `${pos}:${copy.replace("branch-v-", "v:").slice(0, 14)}=ref`;
    const all = scenarios.flatMap((s) =>
      ratiosOf(s, copy, ref, (x) => x === run).map((x) => x.ratio),
    );
    const gm = Math.exp(all.reduce((a, v) => a + Math.log(v), 0) / all.length);
    return `${pos}:${copy.replace("branch-v-", "v:").slice(0, 14)}=${fmt(gm, 3)}`;
  });
  console.log(run.name.padEnd(16), cells.join("  "));
}
