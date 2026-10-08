// Bimodality of G3 scalar arrows depth-3 x64 (copy/main): "D" = deopted mode (> 1.15), "f" = fast mode.
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PERF, loadRuns, buildScenarios, ratiosOf, fmt } from "./lib.mjs";
const R = path.join(PERF, "results/main");
const files = readdirSync(R)
  .filter((f) =>
    /^(full-r\d-c1|combo-r\d|vb-b\d-r\d|x-[\w-]+-r\d)\.json$/u.test(f),
  )
  .sort()
  .map((f) => path.join(R, f));
const runs = loadRuns(files);
const all = buildScenarios(runs);
const key = all.find((s) => /G3 \| scalar arrows depth-3 \| x64/u.test(s.key));
const out = [];
for (const run of runs) {
  if (!run.scenarios.has(key.key)) continue;
  const cells = [];
  for (const [pos, copy] of run.order.entries()) {
    if (copy === "main") {
      cells.push(`${pos}:main`);
      continue;
    }
    const r = ratiosOf(key, copy, "main", (x) => x === run)[0];
    if (!r) continue;
    const mode = copy === "main-aa" ? "" : r.ratio > 1.15 ? "D" : "f";
    cells.push(
      `${pos}:${copy.replace("branch-v-", "").slice(0, 10)}=${fmt(r.ratio, 2)}${mode}`,
    );
    out.push({ run: run.name, pos, copy, ratio: r.ratio, mode });
  }
  console.log(run.name.padEnd(24), cells.join(" "));
}
writeFileSync(
  path.join(PERF, "a8/g3-modes.json"),
  JSON.stringify(out, undefined, 1),
);
