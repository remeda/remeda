import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  TIERS,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  summarize,
  ratiosOf,
  perRunTierGeomeans,
  noiseFloor,
  signConsistent,
  fmt,
} from "./lib.mjs";
import { readVariantsIndex, targetMatches } from "../harness/copies.js";
const R = path.join(PERF, "results/a8");
const runs = loadRuns(
  readdirSync(R)
    .filter((f) => /^cand-r\d\.json$/u.test(f))
    .sort()
    .map((f) => path.join(R, f)),
);
const scenarios = buildScenarios(runs, { fastRef: "branch-v-cand-base" });
const floors = floorsOf(scenarios);
const out = {
  floors: Object.fromEntries(TIERS.map((t) => [t, floors[t]?.p95])),
  compare: {},
  aa: [],
};
for (const run of runs) {
  const all = scenarios.flatMap((s) =>
    ratiosOf(s, "main-aa", "main", (x) => x === run).map((x) => x.ratio),
  );
  const f1 = noiseFloor(
    scenarios
      .filter((s) => s.tier === 1)
      .flatMap((s) =>
        ratiosOf(s, "main-aa", "main", (x) => x === run).map((x) => x.ratio),
      ),
  );
  const gm = Math.exp(all.reduce((a, v) => a + Math.log(v), 0) / all.length);
  out.aa.push({ run: run.name, gm, t1p95: f1?.p95 });
  console.log(
    "A/A",
    run.name,
    run.order.map((c) => c.replace("branch-v-", "")).join(","),
    "gm",
    fmt(gm, 4),
    "T1 p95",
    fmt(f1?.p95),
  );
}
console.log("floors", TIERS.map((t) => fmt(floors[t]?.p95)).join("/"));
const B = "branch-v-cand-base",
  M = "branch-v-cand-map",
  F = "branch-v-cand-forof",
  U = "branch-v-cand-full";
const pairs = [
  ["base/main", B, "main"],
  ["map/main", M, "main"],
  ["forof/main", F, "main"],
  ["full/main", U, "main"],
  ["map/base", M, B],
  ["forof/base", F, B],
  ["full/base", U, B],
  ["full/map", U, M],
  ["full/forof", U, F],
  ["aa/main", "main-aa", "main"],
];
for (const [label, c, r] of pairs) {
  const ev = scenarios.map((s) => evaluate(s, c, r, floors)).filter(Boolean);
  const sum = summarize(ev);
  const pr = perRunTierGeomeans(scenarios, c, r, runs);
  out.compare[label] = {
    tiers: Object.fromEntries(
      TIERS.map((t) => [
        t,
        { n: sum[t].n, gm: sum[t].geomean, counts: sum[t].counts },
      ]),
    ),
    perRun: { 1: pr[1].map((x) => x.geomean), 2: pr[2].map((x) => x.geomean) },
    bars: ev
      .filter((e) => e.bar)
      .map((e) => ({
        key: e.key,
        tier: e.tier,
        median: e.median,
        cf: e.candidateFirst,
        rf: e.referenceFirst,
        note: e.rows.length,
      })),
  };
  console.log(
    `== ${label}`,
    [1, 2]
      .map(
        (t) =>
          `T${t} n${sum[t].n} ${fmt(sum[t].geomean)} [${pr[t].map((x) => fmt(x.geomean)).join(",")}] ${JSON.stringify(sum[t].counts)}`,
      )
      .join(" | "),
  );
  for (const e of ev.filter((x) => x.bar))
    console.log(
      `   BAR T${e.tier} ${e.key} ${fmt(e.median)} (${fmt(e.candidateFirst)}/${fmt(e.referenceFirst)})`,
    );
}
// Variant rule preview on the T1+T2 entries of the targets (2 runs only).
const index = readVariantsIndex();
for (const [name, copy] of [
  ["cand-map", M],
  ["cand-forof", F],
]) {
  const v = index.find((x) => x.name === name);
  const flow = scenarios.filter(
    (s) => targetMatches(v.targets, s) && ratiosOf(s, copy, B).length > 0,
  );
  const perRun = runs.map((run) =>
    flow
      .map((s) => ratiosOf(s, copy, B, (x) => x === run)[0]?.ratio)
      .filter((x) => x !== undefined),
  );
  const sign = signConsistent(perRun);
  out.compare[`${name} flow`] = {
    n: flow.length,
    perRun: sign.perRun,
    overall: sign.overall,
  };
  console.log(
    `flow ${name} n=${flow.length} per run ${sign.perRun.map((x) => fmt(x, 4)).join(",")} overall ${fmt(sign.overall, 4)}`,
  );
}
writeFileSync(
  path.join(PERF, "a8/cand-screen.json"),
  JSON.stringify(out, undefined, 1),
);
