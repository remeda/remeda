// A8 Part 2: the relative screen of design A (combo-a) vs design B (combo-b).
//   node a8/part2.mjs -> a8/part2.json (and a summary on stdout)
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
  fmt,
} from "./lib.mjs";

const R = path.join(PERF, "results/a8");
const files = (re) =>
  readdirSync(R)
    .filter((f) => re.test(f))
    .sort()
    .map((f) => path.join(R, f));
const A = "branch-v-combo-a";
const B = "branch-v-combo-b";
const out = {};

const runs = loadRuns(files(/^screen-(g8-)?r\d\.json$/u));
// The metric (p75, or mean under 1 us) is chosen on main and branch, as in
// the stage aggregation.
const scenarios = buildScenarios(runs);
const floors = floorsOf(scenarios);
out.runs = runs.map((r) => ({
  name: r.name,
  order: r.order,
  wallS: Math.round((r.meta.wallMs ?? 0) / 1000),
  load: r.meta.loadAverage?.map((v) => Number(v.toFixed(2))),
  power: /AC Power/u.test(r.meta.power ?? "") ? "AC" : r.meta.power,
}));
out.floors = Object.fromEntries(
  TIERS.map((t) => [
    t,
    floors[t] && {
      n: floors[t].n,
      median: floors[t].median,
      p95: floors[t].p95,
      max: floors[t].max,
    },
  ]),
);

// A/A per run (systematic offset check) and the A/A false-call rate.
out.aaPerRun = runs.map((run) => {
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
  return {
    run: run.name,
    n: all.length,
    geomean: Math.exp(all.reduce((a, v) => a + Math.log(v), 0) / all.length),
    t1p95: f1?.p95,
  };
});
out.aaFalseCalls = {};
for (const t of TIERS) {
  const ev = scenarios
    .filter((s) => s.tier === t)
    .map((s) => evaluate(s, "main-aa", "main", floors))
    .filter(Boolean);
  const calls = ev.filter((e) => e.verdict !== "neutral");
  out.aaFalseCalls[t] = {
    scenarios: ev.length,
    calls: calls.length,
    bar: calls.filter((e) => e.bar).length,
    keys: calls.map((e) => `${e.key} (${e.verdict} ${fmt(e.median)})`),
  };
}

const pairs = [
  ["comboA_main", A, "main"],
  ["comboB_main", B, "main"],
  ["comboB_comboA", B, A],
  ["branch_main", "branch", "main"],
  ["comboA_branch", A, "branch"],
  ["comboB_branch", B, "branch"],
];
out.compare = {};
for (const [label, cand, ref] of pairs) {
  const ev = scenarios
    .map((s) => evaluate(s, cand, ref, floors))
    .filter(Boolean);
  const summary = summarize(ev);
  out.compare[label] = {
    summary,
    violations: ev
      .filter((e) => e.bar)
      .map((e) => ({
        key: e.key,
        tier: e.tier,
        median: e.median,
        cf: e.candidateFirst,
        rf: e.referenceFirst,
        runs: e.rows.map((r) => r.ratio),
        verdict: e.verdict,
      })),
    above: ev
      .filter(
        (e) =>
          e.tier <= 2 && e.median > 1 + (floors[e.tier]?.p95 ?? 0) && !e.bar,
      )
      .map((e) => ({
        key: e.key,
        tier: e.tier,
        median: e.median,
        cf: e.candidateFirst,
        rf: e.referenceFirst,
        runs: e.rows.map((r) => r.ratio),
        verdict: e.verdict,
      })),
    worstT1: ev
      .filter((e) => e.tier === 1)
      .sort((x, y) => y.median - x.median)
      .slice(0, 8)
      .map((e) => ({
        key: e.key,
        median: e.median,
        cf: e.candidateFirst,
        rf: e.referenceFirst,
        verdict: e.verdict,
      })),
    perRun: perRunTierGeomeans(
      scenarios,
      cand,
      ref,
      runs.filter((r) => !/g8/u.test(r.name)),
    ),
    g8: ev
      .filter((e) => e.group === "G8")
      .map((e) => ({
        key: e.key,
        median: e.median,
        runs: e.rows.map((r) => r.ratio),
        verdict: e.verdict,
      })),
  };
}

// Traps from the validation report prepare.mjs wrote (one measured call).
const validate = JSON.parse(
  readFileSync(path.join(PERF, "results/validate-dist.json"), "utf8"),
);
out.traps = validate.traps.map((t) => ({
  key: t.key,
  counts: Object.fromEntries(
    ["main", "branch", "branch-v-identity-controls-v2", A, B].map((c) => [
      c,
      t.counts[c],
    ]),
  ),
}));
out.validation = Object.fromEntries(
  ["dist", "cjs", "bundle"].map((s) => {
    const v = JSON.parse(
      readFileSync(path.join(PERF, `results/validate-${s}.json`), "utf8"),
    );
    return [
      s,
      {
        copies: v.copies.length,
        scenarios: v.scenarios,
        traceCalls: v.traceCalls,
        outputMismatches: v.outputMismatches.length,
        traceMismatches: v.traceMismatches.length,
        crossOk: v.crossCopy.filter((c) => c.ok).length,
        crossTotal: v.crossCopy.length,
        comboPairs: [
          ...new Set(
            v.crossCopy
              .filter((c) => /combo-[ab]/u.test(c.pair))
              .map((c) => `${c.pair}${c.ok ? "" : " FAILED"}`),
          ),
        ],
        failedCopies: v.failedCopies,
      },
    ];
  }),
);
const reactiveFile = path.join(R, "reactive.json");
if (existsSync(reactiveFile)) {
  const reactive = JSON.parse(readFileSync(reactiveFile, "utf8"));
  out.reactive = reactive.rows ?? reactive;
}
writeFileSync(
  path.join(PERF, "a8/part2.json"),
  `${JSON.stringify(out, undefined, 1)}\n`,
);

// Summary.
console.log(
  "floors",
  TIERS.map((t) => fmt(floors[t]?.p95)).join("/"),
  "A/A per run",
  out.aaPerRun
    .map(
      (x) =>
        `${x.run.split("/")[1]} gm ${fmt(x.geomean, 4)} T1p95 ${fmt(x.t1p95)}`,
    )
    .join(" | "),
);
console.log("A/A false calls", JSON.stringify(out.aaFalseCalls));
for (const [label] of pairs) {
  const c = out.compare[label];
  console.log(
    `== ${label}`,
    TIERS.map(
      (t) =>
        `T${t} n${c.summary[t].n} ${fmt(c.summary[t].geomean)} ${JSON.stringify(c.summary[t].counts)}`,
    ).join(" | "),
  );
  console.log(
    "   per run T1:",
    c.perRun[1].map((x) => fmt(x.geomean)).join(","),
    " T2:",
    c.perRun[2].map((x) => fmt(x.geomean)).join(","),
  );
  for (const v of c.violations)
    console.log(
      `   VIOL T${v.tier} ${v.key} ${fmt(v.median)} (${fmt(v.cf)}/${fmt(v.rf)}) runs ${v.runs.map((x) => fmt(x)).join(",")}`,
    );
  for (const v of c.above)
    console.log(
      `   above floor T${v.tier} ${v.key} ${fmt(v.median)} (${fmt(v.cf)}/${fmt(v.rf)}) ${v.verdict} runs ${v.runs.map((x) => fmt(x)).join(",")}`,
    );
  console.log(
    "   G8:",
    c.g8
      .map(
        (x) => `${x.key.split(" | ").slice(1, 3).join(" ")} ${fmt(x.median)}`,
      )
      .join("; "),
  );
}
