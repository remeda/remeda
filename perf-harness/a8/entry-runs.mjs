// Raw per-run metric (us) for every copy on chosen entries in chosen runs.
import { readdirSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/main");
const re = new RegExp(process.argv[2], "u");
const idRe = new RegExp(process.argv[3], "u");
const files = readdirSync(R)
  .filter((f) => re.test(f))
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
for (const s of buildScenarios(runs).filter((x) => idRe.test(x.key))) {
  console.log("==", s.key, "metric", s.metric);
  for (const { run, entries } of s.perRun) {
    console.log(
      "  ",
      run.name.padEnd(16),
      run.order
        .map(
          (c, i) =>
            `${i}:${c.replace("branch-v-", "").slice(0, 12)}=${fmt((entries[c]?.[s.metric] ?? NaN) * 1000, 2)}`,
        )
        .join(" "),
    );
  }
}
