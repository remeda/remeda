// A8 Part 1: the numbers behind analysis-main.md (results/main only).
//   node a8/part1.mjs  -> a8/part1.json
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  TIERS,
  GROUPS,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  summarize,
  ratiosOf,
  geomean,
  distribution,
  signConsistent,
  perRunTierGeomeans,
} from "./lib.mjs";
import { readVariantsIndex, targetMatches } from "../harness/copies.js";

const R = path.join(PERF, "results/main");
const filesMatching = (re) =>
  readdirSync(R)
    .filter((f) => re.test(f))
    .sort()
    .map((f) => path.join(R, f));

const out = {};

function aaFalseCalls(scenarios, floors, runFilter) {
  const res = {};
  for (const tier of TIERS) {
    const ev = scenarios
      .filter((s) => s.tier === tier)
      .map((s) => evaluate(s, "main-aa", "main", floors, runFilter))
      .filter(Boolean);
    const calls = ev.filter((e) => e.verdict !== "neutral");
    res[tier] = {
      scenarios: ev.length,
      calls: calls.length,
      bar: calls.filter((e) => e.bar).length,
      rate: ev.length === 0 ? undefined : calls.length / ev.length,
      keys: calls.map((e) => `${e.key} (${e.verdict} ${e.median.toFixed(3)})`),
    };
  }
  return res;
}

const slimFloors = (floors) =>
  Object.fromEntries(
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

function violationRows(evaluated, floors) {
  return evaluated
    .filter((e) => e.bar)
    .map((e) => ({
      key: e.key,
      tier: e.tier,
      metric: e.metric,
      median: e.median,
      candidateFirst: e.candidateFirst,
      referenceFirst: e.referenceFirst,
      min: e.min,
      max: e.max,
      floor: floors[e.tier]?.p95,
      verdict: e.verdict,
      perRun: e.rows.map((r) => ({
        run: r.run,
        rotation: r.rotation,
        ratio: r.ratio,
        candidateFirst: r.candidateFirst,
      })),
    }));
}

function compare(scenarios, candidate, reference, floors, runFilter) {
  const ev = scenarios
    .map((s) => evaluate(s, candidate, reference, floors, runFilter))
    .filter(Boolean);
  return {
    summary: summarize(ev),
    violations: violationRows(ev, floors),
    evaluated: ev,
  };
}

function runInfo(runs) {
  return runs.map((r) => ({
    name: r.name,
    order: r.order,
    rotation: r.meta.rotation,
    wallS: Math.round((r.meta.wallMs ?? 0) / 1000),
    startedAt: r.meta.startedAt,
    load: r.meta.loadAverage?.map((v) => Number(v.toFixed(2))),
    power: /AC Power/u.test(r.meta.power ?? "") ? "AC" : r.meta.power,
    scale: r.meta.timeScale,
    source: r.meta.source,
    pollution: r.meta.pollution,
    node: r.meta.node ?? r.meta.runtime,
    flags: r.flags,
  }));
}

// --- A. Full matrix -------------------------------------------------------
{
  const runs = loadRuns(filesMatching(/^full-r\d-c\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const cmp = compare(scenarios, "branch", "main", floors);
  // G3 order check: every G3 entry, per run.
  const g3 = scenarios
    .filter((s) => s.group === "G3")
    .map((s) => ({
      key: s.key,
      tier: s.tier,
      metric: s.metric,
      branch: ratiosOf(s, "branch", "main").map((r) => ({
        run: r.run,
        rotation: r.rotation,
        ratio: r.ratio,
      })),
      aa: ratiosOf(s, "main-aa", "main").map((r) => ({
        run: r.run,
        ratio: r.ratio,
      })),
    }));
  // Native/main for context on the violations.
  out.full = {
    runs: runInfo(runs),
    floors: slimFloors(floors),
    aaFalseCalls: aaFalseCalls(scenarios, floors),
    branchVsMain: { summary: cmp.summary, violations: cmp.violations },
    perRunTier: perRunTierGeomeans(scenarios, "branch", "main", runs),
    g3,
  };
}

// --- B. Combination ---------------------------------------------------------
{
  const runs = loadRuns(filesMatching(/^combo-r\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const comboMain = compare(scenarios, "branch-v-combo", "main", floors);
  const comboBranch = compare(scenarios, "branch-v-combo", "branch", floors);
  const branchMain = compare(scenarios, "branch", "main", floors);
  // Branch violations in these runs and what the combo does on them.
  const fate = branchMain.violations.map((v) => {
    const c = comboMain.evaluated.find((e) => e.key === v.key);
    return {
      key: v.key,
      tier: v.tier,
      branch: v.median,
      combo: c?.median,
      comboFirst: c?.candidateFirst,
      mainFirst: c?.referenceFirst,
      comboVerdict: c?.verdict,
    };
  });
  out.combo = {
    runs: runInfo(runs),
    floors: slimFloors(floors),
    aaFalseCalls: aaFalseCalls(scenarios, floors),
    comboVsMain: {
      summary: comboMain.summary,
      violations: comboMain.violations,
    },
    comboVsBranch: {
      summary: comboBranch.summary,
      violations: comboBranch.violations,
      slower: comboBranch.evaluated
        .filter((e) => e.verdict !== "neutral" && e.verdict !== "faster")
        .map((e) => ({
          key: e.key,
          tier: e.tier,
          median: e.median,
          verdict: e.verdict,
          cf: e.candidateFirst,
          rf: e.referenceFirst,
        })),
      above1_03: comboBranch.evaluated
        .filter((e) => e.tier <= 2 && e.median > 1.03)
        .map((e) => ({
          key: e.key,
          tier: e.tier,
          median: e.median,
          cf: e.candidateFirst,
          rf: e.referenceFirst,
          verdict: e.verdict,
        })),
    },
    branchVsMain: {
      summary: branchMain.summary,
      violations: branchMain.violations,
    },
    branchViolationFate: fate,
    perRunTier: {
      comboMain: perRunTierGeomeans(scenarios, "branch-v-combo", "main", runs),
      comboBranch: perRunTierGeomeans(
        scenarios,
        "branch-v-combo",
        "branch",
        runs,
      ),
      branchMain: perRunTierGeomeans(scenarios, "branch", "main", runs),
    },
  };
}

// --- C. Variant confirmation -----------------------------------------------
{
  const runs = loadRuns(filesMatching(/^vb-b\d-r\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios); // pooled, as the official report
  const official = JSON.parse(
    readFileSync(path.join(R, "survivors.json"), "utf8"),
  );
  const index = readVariantsIndex();
  const batchOf = (run) => run.name.match(/vb-(b\d)-/u)[1];
  const batches = [...new Set(runs.map(batchOf))];
  const perBatch = {};
  for (const b of batches) {
    const filter = (run) => batchOf(run) === b;
    const bRuns = runs.filter(filter);
    const bFloors = floorsOf(scenarios, filter);
    const branchMain = compare(scenarios, "branch", "main", floors, filter);
    perBatch[b] = {
      runs: runInfo(bRuns),
      copies: bRuns[0].order.filter((c) => c.startsWith("branch-v-")),
      floorsBatch: slimFloors(bFloors),
      aaFalseCalls: aaFalseCalls(scenarios, floors, filter),
      branchViolations: branchMain.violations.map((v) => ({
        key: v.key,
        tier: v.tier,
        median: v.median,
        cf: v.candidateFirst,
        rf: v.referenceFirst,
        perRun: v.perRun,
      })),
      branchSummary: branchMain.summary,
    };
  }
  const variants = [];
  for (const report of official.reports) {
    const copy = report.copy;
    const variant = index.find((v) => v.copyId === copy);
    const b = batches.find((x) => perBatch[x].copies.includes(copy));
    const filter = (run) => batchOf(run) === b;
    const bRuns = runs.filter(filter);
    const measured = scenarios.filter((s) =>
      s.perRun.some(
        ({ run, entries }) => filter(run) && entries[copy] !== undefined,
      ),
    );
    const flow = measured.filter((s) => targetMatches(variant.targets, s));
    // Sign test recomputed (per run geomean over the flow, variant/branch).
    const perRunFlow = bRuns.map((run) =>
      flow
        .map((s) => ratiosOf(s, copy, "branch", (x) => x === run)[0]?.ratio)
        .filter((v) => v !== undefined),
    );
    const sign = signConsistent(perRunFlow);
    const vsBranch = compare(measured, copy, "branch", floors, filter);
    const vsMain = compare(measured, copy, "main", floors, filter);
    const branchMain = compare(measured, "branch", "main", floors, filter);
    const branchBar = new Map(branchMain.evaluated.map((e) => [e.key, e]));
    const official_ = report.violations;
    const newVsMain = vsMain.violations
      .filter((v) => !branchBar.get(v.key)?.bar)
      .map((v) => ({
        key: v.key,
        tier: v.tier,
        variant: v.median,
        branch: branchBar.get(v.key)?.median,
        branchVerdict: branchBar.get(v.key)?.verdict,
        vf: v.candidateFirst,
        mf: v.referenceFirst,
        variantOverBranch: vsBranch.evaluated.find((e) => e.key === v.key)
          ?.median,
        variantOverBranchVerdict: vsBranch.evaluated.find(
          (e) => e.key === v.key,
        )?.verdict,
      }));
    const inherited = vsMain.violations
      .filter((v) => branchBar.get(v.key)?.bar)
      .map((v) => ({
        key: v.key,
        tier: v.tier,
        variant: v.median,
        branch: branchBar.get(v.key)?.median,
      }));
    const fixed = branchMain.violations
      .filter((v) => !vsMain.evaluated.find((e) => e.key === v.key)?.bar)
      .map((v) => ({
        key: v.key,
        tier: v.tier,
        branch: v.median,
        variant: vsMain.evaluated.find((e) => e.key === v.key)?.median,
      }));
    const tierFx = {};
    for (const t of TIERS) {
      const vb = vsBranch.summary[t];
      const vm = vsMain.summary[t];
      const bm = branchMain.summary[t];
      tierFx[t] = {
        n: vb.n,
        variantOverBranch: vb.geomean,
        variantOverMain: vm.geomean,
        branchOverMain: bm.geomean,
        vsBranchCounts: vb.counts,
      };
    }
    // Per run, per tier: variant/branch weighted geomean.
    const perRun = perRunTierGeomeans(measured, copy, "branch", bRuns);
    variants.push({
      name: report.name,
      copy,
      batch: b,
      flowSize: flow.length,
      sign: { ...sign, official: report.sign },
      officialViolations: official_,
      officialPasses: report.passes,
      aaRate: report.aaRate,
      aaSameFlow: report.aaSameFlow,
      vsBranchBar: vsBranch.violations.map((v) => ({
        key: v.key,
        tier: v.tier,
        median: v.median,
        vf: v.candidateFirst,
        bf: v.referenceFirst,
        verdict: v.verdict,
        perRun: v.perRun.map((r) => Number(r.ratio.toFixed(3))),
      })),
      vsBranchSlowT1: vsBranch.evaluated
        .filter((e) => e.tier === 1 && e.median > 1.03)
        .map((e) => ({
          key: e.key,
          median: e.median,
          vf: e.candidateFirst,
          bf: e.referenceFirst,
          verdict: e.verdict,
        })),
      newVsMain,
      inherited,
      fixed,
      tierFx,
      perRunTier: perRun,
    });
  }
  out.variants = {
    runs: runInfo(runs),
    floorsPooled: slimFloors(floors),
    aaFalseCallsPooled: aaFalseCalls(scenarios, floors),
    perBatch,
    variants,
  };
}

// --- D. Extras ----------------------------------------------------------------
{
  const extras = {};
  for (const name of [
    "x-jitless",
    "x-maxopt1",
    "x-maxopt2",
    "x-p0",
    "x-p1",
    "x-node22",
    "x-node24",
    "x-bundle",
    "x-cjs",
    "x-bun",
    "x-portable-node",
    "x-isolated",
  ]) {
    const runs = loadRuns(
      filesMatching(new RegExp(`^${name}-r\\d\\.json$`, "u")),
    );
    const scenarios = buildScenarios(runs);
    const floors = floorsOf(scenarios);
    const cmp = compare(scenarios, "branch", "main", floors);
    const above = cmp.evaluated
      .filter((e) => e.median > 1 + (floors[e.tier]?.p95 ?? 0))
      .map((e) => ({
        key: e.key,
        tier: e.tier,
        median: e.median,
        cf: e.candidateFirst,
        rf: e.referenceFirst,
        verdict: e.verdict,
        min: e.min,
        max: e.max,
      }));
    extras[name] = {
      runs: runInfo(runs),
      floors: slimFloors(floors),
      aaFalseCalls: aaFalseCalls(scenarios, floors),
      summary: cmp.summary,
      violations: cmp.violations.map((v) => ({
        key: v.key,
        tier: v.tier,
        median: v.median,
        cf: v.candidateFirst,
        rf: v.referenceFirst,
        verdict: v.verdict,
        min: v.min,
        max: v.max,
      })),
      aboveFloor: above,
      lowerJit: runs.some((r) => /--jitless|--max-opt/u.test(r.flags)),
    };
  }
  out.extras = extras;
}

writeFileSync(
  path.join(PERF, "a8/part1.json"),
  `${JSON.stringify(out, undefined, 1)}\n`,
);
console.log("written a8/part1.json");
