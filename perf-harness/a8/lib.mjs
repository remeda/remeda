// A8 analysis helpers: the same loading, metric choice, floors and verdicts as
// scripts/aggregate.mjs, but for any candidate/reference pair and any subset
// of runs (per batch, per rotation).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { SCENARIOS } from "../harness/scenarios.js";
import { POPULARITY_WEIGHTS, tierOf } from "../harness/tiers.js";
import {
  distribution,
  geomean,
  noiseFloor,
  signConsistent,
  verdictFor,
  violatesBar,
} from "../harness/verdicts.js";

export {
  distribution,
  geomean,
  noiseFloor,
  signConsistent,
  verdictFor,
  violatesBar,
};

export const PERF = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);
export const GROUPS = [
  "G1",
  "G1b",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
];
export const TIERS = [1, 2, 3];

const definitions = new Map(SCENARIOS.map((d) => [`${d.group}|${d.id}`, d]));

export function loadRuns(files) {
  return files
    .filter(
      (file) =>
        existsSync(file) &&
        file.endsWith(".json") &&
        !file.endsWith(".meta.json"),
    )
    .map((file) => {
      const json = JSON.parse(readFileSync(file, "utf8"));
      const metaFile = file.replace(/\.json$/u, ".meta.json");
      const meta = existsSync(metaFile)
        ? JSON.parse(readFileSync(metaFile, "utf8"))
        : {};
      const scenarios = new Map();
      for (const benchFile of json.files) {
        for (const group of benchFile.groups) {
          const key = group.fullName.split(" > ").at(-1);
          const entries = scenarios.get(key) ?? {};
          for (const b of group.benchmarks) {
            entries[b.name] = {
              p75: b.p75,
              mean: b.mean,
              rme: b.rme,
              samples: b.sampleCount,
            };
          }
          scenarios.set(key, entries);
        }
      }
      return {
        name: meta.name ?? path.basename(file, ".json"),
        file,
        meta,
        order: meta.order ?? meta.libs ?? [],
        flags: (meta.nodeFlags ?? []).join(" "),
        scenarios,
      };
    });
}

/**
 * Scenario table as aggregate.mjs builds it: tier (all 3 for lower JIT
 * tiers), popularity weight, and the metric (mean when the faster of main and
 * `fastRef` has a median p75 under 1 us).
 */
export function buildScenarios(
  runs,
  { fastRef = "branch", minP75Ms = 0.001 } = {},
) {
  const lowerJit = runs.some((run) => /--jitless|--max-opt/u.test(run.flags));
  const keys = new Set();
  for (const run of runs) for (const key of run.scenarios.keys()) keys.add(key);
  return [...keys].map((key) => {
    const [group, id, size, tags] = key.split(" | ");
    const definition = definitions.get(`${group}|${id}`);
    const shape = {
      group,
      id,
      size,
      tags: tags === undefined ? [] : tags.split(","),
      kind: definition?.kind,
      main: definition?.main ?? "?",
    };
    const tierInfo =
      definition === undefined
        ? { tier: 3, popularity: "high", popularityDefaulted: true }
        : tierOf(shape);
    const perRun = runs
      .filter((run) => run.scenarios.has(key))
      .map((run) => ({ run, entries: run.scenarios.get(key) }));
    const medianOf = (copy, stat) =>
      distribution(perRun.map((row) => row.entries[copy]?.[stat]))?.median;
    const fastest = Math.min(
      medianOf("main", "p75") ?? Infinity,
      medianOf(fastRef, "p75") ?? Infinity,
    );
    return {
      key,
      ...shape,
      ...tierInfo,
      tier: lowerJit ? 3 : tierInfo.tier,
      weight: POPULARITY_WEIGHTS[tierInfo.popularity] ?? 1,
      metric: fastest < minP75Ms ? "mean" : "p75",
      perRun,
      medianOf,
    };
  });
}

/** Per run: candidate/reference on the scenario's metric; `runFilter` picks runs. */
export function ratiosOf(
  scenario,
  candidate,
  reference = "main",
  runFilter = () => true,
) {
  const rows = [];
  for (const { run, entries } of scenario.perRun) {
    if (!runFilter(run)) continue;
    const top = entries[candidate];
    const bottom = entries[reference];
    if (top === undefined || bottom === undefined) continue;
    const p75 = bottom.p75 > 0 ? top.p75 / bottom.p75 : undefined;
    const mean = bottom.mean > 0 ? top.mean / bottom.mean : undefined;
    const ci = run.order.indexOf(candidate);
    const ri = run.order.indexOf(reference);
    rows.push({
      run: run.name,
      rotation: run.meta.rotation,
      p75,
      mean,
      ratio: scenario.metric === "mean" ? mean : p75,
      candidateFirst: ci !== -1 && ri !== -1 && ci < ri,
    });
  }
  return rows.filter((row) => Number.isFinite(row.ratio));
}

export function floorsOf(scenarios, runFilter = () => true) {
  const floors = {};
  for (const tier of TIERS) {
    floors[tier] = noiseFloor(
      scenarios
        .filter((s) => s.tier === tier)
        .flatMap((s) =>
          ratiosOf(s, "main-aa", "main", runFilter).map((r) => r.ratio),
        ),
    );
  }
  return floors;
}

export function evaluate(
  scenario,
  candidate,
  reference,
  floors,
  runFilter = () => true,
) {
  const rows = ratiosOf(scenario, candidate, reference, runFilter);
  if (rows.length === 0) return undefined;
  const verdict = verdictFor(scenario.tier, rows, floors[scenario.tier]?.p95);
  const firstMedian = distribution(
    rows.filter((r) => r.candidateFirst).map((r) => r.ratio),
  )?.median;
  const refFirstMedian = distribution(
    rows.filter((r) => !r.candidateFirst).map((r) => r.ratio),
  )?.median;
  return {
    key: scenario.key,
    group: scenario.group,
    id: scenario.id,
    size: scenario.size,
    tier: scenario.tier,
    popularity: scenario.popularity,
    weight: scenario.weight,
    metric: scenario.metric,
    rows,
    median: distribution(rows.map((r) => r.ratio)).median,
    min: Math.min(...rows.map((r) => r.ratio)),
    max: Math.max(...rows.map((r) => r.ratio)),
    candidateFirst: firstMedian,
    referenceFirst: refFirstMedian,
    verdict: verdict.verdict,
    bar: violatesBar(verdict.verdict),
  };
}

/** Per tier (and per group within each tier) weighted geomeans and counts. */
export function summarize(evaluated) {
  const out = {};
  for (const tier of TIERS) {
    const rows = evaluated.filter((e) => e.tier === tier);
    const counts = {};
    for (const r of rows) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
    const groups = {};
    for (const g of GROUPS) {
      const gr = rows.filter((r) => r.group === g);
      if (gr.length === 0) continue;
      const gc = {};
      for (const r of gr) gc[r.verdict] = (gc[r.verdict] ?? 0) + 1;
      groups[g] = {
        n: gr.length,
        geomean: geomean(
          gr.map((r) => r.median),
          gr.map((r) => r.weight),
        ),
        counts: gc,
        bar: gr.filter((r) => r.bar).length,
      };
    }
    out[tier] = {
      n: rows.length,
      geomean: geomean(
        rows.map((r) => r.median),
        rows.map((r) => r.weight),
      ),
      unweighted: geomean(rows.map((r) => r.median)),
      counts,
      bar: rows.filter((r) => r.bar).map((r) => r.key),
      groups,
    };
  }
  return out;
}

/** Weighted geomean per tier over each run separately (per-run view). */
export function perRunTierGeomeans(scenarios, candidate, reference, runs) {
  const out = {};
  for (const tier of TIERS) {
    out[tier] = runs.map((run) => {
      const values = [];
      const weights = [];
      for (const s of scenarios.filter((x) => x.tier === tier)) {
        const r = ratiosOf(s, candidate, reference, (x) => x === run)[0];
        if (r !== undefined) {
          values.push(r.ratio);
          weights.push(s.weight);
        }
      }
      return {
        run: run.name,
        n: values.length,
        geomean: geomean(values, weights),
      };
    });
  }
  return out;
}

export const fmt = (v, d = 3) =>
  v === undefined || !Number.isFinite(v) ? "-" : v.toFixed(d);
export const shortKey = (key) =>
  key.replace(/ \| (headline|data-first-guard|traps)(,[\w-]+)*$/u, "");
