// G3 multi-function non-lazy pipes: copy/main per run, every copy, with the copy's position.
import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/main");
const re = new RegExp(process.argv[2], "u");
const idRe = new RegExp(
  process.argv[3] ?? "scalar arrows depth-3 \\| x64",
  "u",
);
const files = readdirSync(R)
  .filter((f) => re.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const scenarios = buildScenarios(runs).filter((s) => idRe.test(s.key));
for (const s of scenarios) {
  console.log("==", s.key, s.metric);
  for (const run of runs) {
    if (!run.scenarios.has(s.key)) continue;
    const cells = run.order.map((copy, pos) => {
      if (copy === "main") return `${pos}:main`;
      const r = ratiosOf(s, copy, "main", (x) => x === run)[0];
      return `${pos}:${copy.replace("branch-v-", "").slice(0, 12)}=${fmt(r?.ratio)}`;
    });
    console.log("  ", run.name.padEnd(18), cells.join(" "));
  }
}
