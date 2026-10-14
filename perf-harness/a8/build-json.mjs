// Key numbers of the A8 analysis as one JSON file (analysis-main.json), from
// a8/part1.json, a8/part1b.json and a8/part2.json.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PERF } from "./lib.mjs";

const read = (file) => JSON.parse(readFileSync(path.join(PERF, file), "utf8"));
const p1 = read("a8/part1.json");
const p1b = read("a8/part1b.json");
const p2 = existsSync(path.join(PERF, "a8/part2.json"))
  ? read("a8/part2.json")
  : undefined;
const r = (v, d = 4) =>
  typeof v === "number" && Number.isFinite(v) ? Number(v.toFixed(d)) : v;
const tiers = (summary) =>
  Object.fromEntries(
    [1, 2, 3]
      .filter((t) => summary[t]?.n > 0)
      .map((t) => [
        `T${t}`,
        {
          n: summary[t].n,
          weightedGeomean: r(summary[t].geomean),
          verdicts: summary[t].counts,
          barViolations: summary[t].bar.length,
          groups: Object.fromEntries(
            Object.entries(summary[t].groups).map(([g, x]) => [
              g,
              { n: x.n, weightedGeomean: r(x.geomean), bar: x.bar },
            ]),
          ),
        },
      ]),
  );
const floors = (f) =>
  Object.fromEntries(
    Object.entries(f)
      .filter(([, v]) => v)
      .map(([t, v]) => [`T${t}`, r(v.p95)]),
  );
const aa = (calls) =>
  Object.fromEntries(
    Object.entries(calls).map(([t, v]) => [
      `T${t}`,
      { calls: v.calls, scenarios: v.scenarios, bar: v.bar, keys: v.keys },
    ]),
  );
const viol = (list) =>
  list.map((v) => ({
    key: v.key,
    tier: v.tier,
    median: r(v.median),
    candidateFirst: r(v.candidateFirst ?? v.cf),
    referenceFirst: r(v.referenceFirst ?? v.rf),
  }));

const verdicts = {
  "pipe-single-step-runs": [
    "ADOPT",
    "6/6, 0.973; no violation at all: removes the G3 deopt cluster",
  ],
  "pipe-on-demand-segments": [
    "ADOPT",
    "6/6, 0.984, its one violation inherited; contained in pipe-single-step-runs",
  ],
  "pipe-array-index-loop": ["ADOPT", "6/6, 0.939; no loss vs branch"],
  "pipe-isarray-first": ["ADOPT", "6/6, 0.949; no loss vs branch"],
  "map-callback-as-evaluator": [
    "ADOPT",
    "6/6, 0.942; no loss vs branch; incompatible with identity-controls-v2",
  ],
  "single-array-index-loop": [
    "ADOPT",
    "6/6, 0.910; no loss vs branch; largest tier 1 gain",
  ],
  "datalast-direct-props": ["ADOPT", "6/6, 0.886; no loss vs branch"],
  "unique-single-lookup": [
    "ADOPT",
    "6/6, 0.985 (13-entry flow); no loss vs branch",
  ],
  "requiredata-direct-write": [
    "INCONCLUSIVE",
    "3/6, 1.000 on its declared flow, which is mostly off its code path; 6/6 faster (XS 0.85-0.97) on the 19 data-reading / length-0 entries; needs a pre-declared re-run",
  ],
  "datalast-arity-closures": ["REJECT", "6/6 but 0.9911, short of the 1% bar"],
  "lazy-args-arity": ["REJECT", "6/6 but 0.9949, short of the 1% bar"],
  "pipe-last-index": ["REJECT", "6/6 but 0.9957, short of the 1% bar"],
  "purry-arity-calls": [
    "REJECT",
    "sign test passes (0.973) but tier 2 G7 clamp data-last C 1.067 vs branch in every run, on its own code path",
  ],
  "single-skip-identity": [
    "REJECT",
    "sign test passes (0.972) but tier 1 losses vs branch: G1 map C 1.059, G1b pipe map S 1.046",
  ],
  "pipe-skip-identity": [
    "REJECT",
    "3/6, 1.0008; tier 1/2 losses on map-heavy pipes",
  ],
  "single-skip-first": ["REJECT", "3/6, 1.0007"],
  "requiredata-positional-index": ["REJECT", "2/6, 1.0007"],
  "first-index-access": ["REJECT", "3/6, 1.0004"],
  "identity-controls-v2": [
    "DESIGN",
    "6/6, 0.849; T1/T2/T3 vs branch 0.911/0.832/0.787 (no G3 cluster); no loss",
  ],
  "sentinel-module": [
    "DESIGN",
    "timing neutral (4/6, 1.0001; 1.000/1.000/0.999 vs branch); in both combinations",
  ],
};

const out = {
  generatedBy: "a8/build-json.mjs",
  branch: "144fdc8b6208b40b7fc1f0690ecc99dd17c2a5a6",
  main: "8e6e78f6eaf66eaf0b4797d72cc3691823c91335",
  notes: [
    "Ratios are copy/reference (< 1 = faster); weighted geomean = popularity-weighted geomean of per-scenario medians (high 4, mid 2, low 1).",
    "Variant verdicts charge a variant with its own losses vs branch (tier rules) and with bar violations vs main that the branch does not share in the same batch, except the G3 deopt cluster; read literally, only pipe-single-step-runs passes (results/main/survivors.json).",
    "Part 2 numbers come from the agent sandbox: relative only.",
  ],
  part1: {
    dataQuality: {
      floors: {
        full: floors(p1.full.floors),
        combo: floors(p1.combo.floors),
        variantsPooled: floors(p1.variants.floorsPooled),
        perBatch: Object.fromEntries(
          Object.entries(p1.variants.perBatch).map(([b, x]) => [
            b,
            floors(x.floorsBatch),
          ]),
        ),
        extras: Object.fromEntries(
          Object.entries(p1.extras).map(([k, x]) => [k, floors(x.floors)]),
        ),
      },
      aaFalseCalls: {
        full: aa(p1.full.aaFalseCalls),
        combo: aa(p1.combo.aaFalseCalls),
        variantsPooled: aa(p1.variants.aaFalseCallsPooled),
      },
      positionInteraction:
        "b2/b3 rotations 1-2 and combo-r1: systematic A/A offset (geomean 1.033-1.050, T1 p95 0.13-0.15) when main-aa runs before and main after those copies",
      userInputDuringSteps: [
        "full-r0-c1",
        "combo-r1",
        "vb-b1-r0",
        "vb-b1-r4",
        "vb-b4-r0",
        "vb-b6-r2",
        "vb-b7-r5",
      ],
      highLoadAtStart: { "vb-b1-r0": 3.68, "vb-b7-r3": 4.86, "vb-b7-r4": 3.52 },
      g3Deopt: {
        fullMatrix:
          "branch in the deopt mode in both rotations (1.354 main first, 1.347 branch first)",
        variantBatches:
          "branch deopted in 39/42 runs; other step-array copies 90 deopt / 18 fast; on-demand pipes 0 / 12",
        extras:
          "deopt on Node 24 (vitest, dist); none on Node 22, Bun, bundle, cjs, portable runner, jitless, max-opt; one copy per process 1.045",
      },
    },
    branchVsMain: {
      full: tiers(p1.full.branchVsMain.summary),
      withoutG3Cluster: {
        T1: r(p1b.fullNoG3[1].geomean),
        T2: r(p1b.fullNoG3[2].geomean),
        T3: r(p1b.fullNoG3[3].geomean),
      },
      violations: viol(p1.full.branchVsMain.violations),
    },
    comboPatch: {
      vsMain: tiers(p1.combo.comboVsMain.summary),
      vsBranch: tiers(p1.combo.comboVsBranch.summary),
      violationsVsMain: viol(p1.combo.comboVsMain.violations),
      branchViolationFate: p1.combo.branchViolationFate.map((x) => ({
        key: x.key,
        tier: x.tier,
        branch: r(x.branch),
        combo: r(x.combo),
        comboVerdict: x.comboVerdict,
      })),
    },
    variants: p1.variants.variants.map((v) => ({
      name: v.name,
      batch: v.batch,
      flowSize: v.flowSize,
      flowGeomeanPerRun: v.sign.perRun.map((x) => r(x)),
      flowGeomean: r(v.sign.overall),
      fasterRuns: `${v.sign.fasterRuns}/${v.sign.runs}`,
      signFires: v.sign.fires,
      vsBranchNoG3: Object.fromEntries(
        [1, 2, 3].map((t) => [`T${t}`, r(p1b.variantsNoG3[v.name][t].geomean)]),
      ),
      officialViolationsVsMain: v.officialViolations.length,
      inherited: v.inherited.length,
      newVsMain: v.newVsMain.map((n) => ({
        key: n.key,
        tier: n.tier,
        variant: r(n.variant),
        branch: r(n.branch),
        variantOverBranch: r(n.variantOverBranch),
      })),
      lossesVsBranch: v.vsBranchBar.map((x) => ({
        key: x.key,
        tier: x.tier,
        median: r(x.median),
        perRun: x.perRun,
      })),
      aaFireRate: v.aaRate,
      verdict: verdicts[v.name]?.[0],
      reason: verdicts[v.name]?.[1],
    })),
    extras: Object.fromEntries(
      Object.entries(p1.extras).map(([k, x]) => [
        k,
        {
          tiers: Object.fromEntries(
            [1, 2, 3]
              .filter((t) => x.summary[t].n > 0)
              .map((t) => [
                `T${t}`,
                { n: x.summary[t].n, weightedGeomean: r(x.summary[t].geomean) },
              ]),
          ),
          violations: viol(x.violations),
        },
      ]),
    ),
  },
};
if (p2 !== undefined) {
  out.part2 = {
    screen: {
      runs: p2.runs,
      floors: floors(p2.floors),
      aaPerRun: p2.aaPerRun.map((x) => ({
        run: x.run,
        geomean: r(x.geomean),
        t1p95: r(x.t1p95),
      })),
      aaFalseCalls: aa(p2.aaFalseCalls),
    },
    compare: Object.fromEntries(
      Object.entries(p2.compare).map(([k, c]) => [
        k,
        {
          tiers: tiers(c.summary),
          violations: viol(c.violations),
          perRunT1: c.perRun[1].map((x) => r(x.geomean)),
          perRunT2: c.perRun[2].map((x) => r(x.geomean)),
          g8: c.g8.map((x) => ({ key: x.key, median: r(x.median) })),
        },
      ]),
    ),
    traps: p2.traps,
    validation: p2.validation,
    reactive: p2.reactive,
  };
  const sensFile = path.join(PERF, "a8/part2-sens.json");
  if (existsSync(sensFile)) {
    const sens = JSON.parse(readFileSync(sensFile, "utf8"));
    out.part2.cleanRotationFloors = {
      note: "floors from rotations 1-2 only (rotation 0 carries the position offset), verdicts over all 3 runs",
      floors: Object.fromEntries(
        Object.entries(sens.floors).map(([t, v]) => [`T${t}`, r(v)]),
      ),
      violations: Object.fromEntries(
        Object.entries(sens.compare).map(([k, list]) => [k, viol(list)]),
      ),
    };
  }
  const reactiveAttr = path.join(PERF, "results/a8/reactive-attr.json");
  if (existsSync(reactiveAttr)) {
    const attr = JSON.parse(readFileSync(reactiveAttr, "utf8"));
    out.part2.reactiveAttribution = attr.rows ?? attr;
  }
  const vueShapes = path.join(PERF, "a8/vue-shapes.txt");
  if (existsSync(vueShapes)) {
    out.part2.vueDependencyCountsByShape = readFileSync(vueShapes, "utf8")
      .trim()
      .split("\n");
  }
  const bundle = path.join(PERF, "results/a8/bundle.json");
  if (existsSync(bundle)) {
    out.part2.bundle = JSON.parse(readFileSync(bundle, "utf8")).rows.map(
      (row) => ({
        entry: row.entry,
        bundler: row.bundler,
        ...Object.fromEntries(
          [
            "main",
            "branch",
            "branch-v-sentinel-module",
            "branch-v-identity-controls-v2",
            "branch-v-combo-a",
            "branch-v-combo-b",
          ].map((copy) => [
            copy,
            row[copy] && {
              minified: row[copy].minified,
              gzip: row[copy].gzip,
              sentinel: row[copy].hasProxy,
            },
          ]),
        ),
      }),
    );
  }
  out.part2.designComparison = {
    comboA:
      "branch controls + pipe-single-step-runs, pipe-array-index-loop, pipe-isarray-first, map-callback-as-evaluator, single-array-index-loop, datalast-direct-props, unique-single-lookup, sentinel-module (variants/combo-a.patch)",
    comboB:
      "identity-controls-v2 + the same set without map-callback-as-evaluator (incompatible), ported by hand (variants/combo-b.patch)",
    verdict:
      "No tier bar violation against main for either (any floor). Lexicographic (tier 1 first): B ranks first, T1 0.935 / T2 0.845 / G8 0.58 of A, tolerance 0.5%. B is slower than A on map-heavy lazy pipes (with the clean-rotation floors 13 tier 1 and 6 tier 2 entries, up to 1.31x), the share of map-callback-as-evaluator. Both regress Vue reactive-array tracking through the indexed loops (pipe-array-index-loop, single-array-index-loop).",
  };
}
writeFileSync(
  path.join(PERF, "analysis-main.json"),
  `${JSON.stringify(out, undefined, 1)}\n`,
);
console.log("wrote analysis-main.json");
