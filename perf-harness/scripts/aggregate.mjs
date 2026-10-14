// Aggregates N result files (vitest `--outputJson`, or run-portable.mjs
// output) into Markdown and JSON.
//
//   node scripts/aggregate.mjs --out results/agg-name [--title ...]
//     [--min-p75-us 1] [--candidates branch,branch-v-x]
//     [--survivors-out results/main/survivors.json]
//     [--validate results/validate-dist.json] [--aa-draws 2000]
//     results/run-1.json results/run-2.json ...
//
// Writes <out>.md (ordered tier 1 -> 3), <out>.details.md (every entry of
// every run) and <out>.json.
//
// Ratios are copy/main (< 1 = faster than main), per run, on each scenario's
// metric: the p75, or the mean when the fastest of main and branch has a p75
// under --min-p75-us (the timer ticks every 41.67ns here, so such a p75 moves
// in steps of several percent; marked "*"). Tables show p75 and mean ratios
// side by side either way.
//
// Tiers come from harness/tiers.js (scenario shape and size, lowered by the
// main utility's popularity). Runs with --jitless or --max-opt flags are
// lower JIT tiers: every scenario of such an aggregation is tier 3.
// Verdict rules: harness/verdicts.js. Per-tier A/A floors: the p95 of
// |main-aa/main - 1| over the tier's (scenario, run) pairs. The same
// classifier applied to main-aa vs main gives the false-call rate.
//
// Variant report (when branch-v-* copies are present): a variant passes when
// it is faster than branch in every run on its target flow (per-run geomean
// < 1), with overall geomean <= 0.99, has no tier-bar violation against main,
// and the same sign test fires on A/A (main-aa vs main, both directions, on
// random flows of the same size) less than 5% of the time.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { readVariantsIndex, targetMatches } from "../harness/copies.js";
import { SCENARIOS } from "../harness/scenarios.js";
import {
  POPULARITY_WEIGHTS,
  popularityData,
  tierOf,
  tierOverrides,
} from "../harness/tiers.js";
import {
  distribution,
  geomean,
  lexicographicCompare,
  noiseFloor,
  seededRandom,
  signConsistent,
  verdictFor,
  violatesBar,
} from "../harness/verdicts.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string" },
    title: { type: "string", default: "" },
    "min-p75-us": { type: "string", default: "1" },
    candidates: { type: "string", default: "" },
    "survivors-out": { type: "string", default: "" },
    validate: { type: "string", default: "" },
    "aa-draws": { type: "string", default: "2000" },
    "allow-empty": { type: "boolean", default: false },
  },
});
if (values.out === undefined || positionals.length === 0) {
  throw new Error(
    "usage: node scripts/aggregate.mjs --out <prefix> <run.json> [...]",
  );
}

const GROUP_ORDER = [
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
const SIZE_ORDER = ["XS", "S", "C", "M", "Mx64", "L", "x64", "x1"];
const BASELINE = "main";
const AA = "main-aa";
const TIERS = [1, 2, 3];

// --- Load ---------------------------------------------------------------------

// Globs like `results/main/full-r*.json` also match the sidecars.
const resultFiles = positionals.filter(
  (file) =>
    existsSync(file) &&
    file.endsWith(".json") &&
    !file.endsWith(".meta.json") &&
    !/\.part-[^/]*$/u.test(file),
);

const runs = resultFiles
  .map((file) => ({ file, json: JSON.parse(readFileSync(file, "utf8")) }))
  .filter(({ file, json }) => {
    if (Array.isArray(json.files)) {
      return true;
    }
    process.stderr.write(
      `[aggregate] skipping ${file}: not a benchmark result\n`,
    );
    return false;
  })
  .map(({ file, json }) => {
    const metaFile = file.replace(/\.json$/u, ".meta.json");
    const meta = existsSync(metaFile)
      ? JSON.parse(readFileSync(metaFile, "utf8"))
      : {};
    const scenarios = new Map();
    for (const benchFile of json.files) {
      for (const group of benchFile.groups) {
        const key = group.fullName.split(" > ").at(-1);
        const entries = scenarios.get(key) ?? {};
        for (const benchmark of group.benchmarks) {
          entries[benchmark.name] = {
            p75: benchmark.p75,
            mean: benchmark.mean,
            rme: benchmark.rme,
            samples: benchmark.sampleCount,
          };
        }
        scenarios.set(key, entries);
      }
    }
    const order = meta.order ?? meta.libs ?? [];
    return {
      name: meta.name ?? path.basename(file, ".json"),
      file,
      meta,
      order,
      runner: meta.runner ?? "vitest",
      flags: (meta.nodeFlags ?? []).join(" "),
      scenarios,
    };
  });
if (runs.length === 0) {
  if (!values["allow-empty"]) {
    throw new Error("none of the given result files exist");
  }
  // A stage step whose inputs were skipped (no variants, no combination):
  // leave a note, and an empty survivors list when one was asked for.
  writeFileSync(
    `${values.out}.md`,
    `# ${values.title === "" ? "Remeda perf" : values.title}\n\nNo result files matched: ${positionals.join(" ")}\n`,
  );
  if (values["survivors-out"] !== "") {
    writeFileSync(
      values["survivors-out"],
      `${JSON.stringify({ generatedAt: new Date().toISOString(), runs: [], survivors: [], reports: [] }, undefined, 2)}\n`,
    );
  }
  process.stdout.write(`[aggregate] no inputs; wrote ${values.out}.md\n`);
  process.exit(0);
}

const lowerJitTier = runs.some((run) => /--jitless|--max-opt/u.test(run.flags));

function describeSetup(run) {
  return [
    run.runner,
    run.meta.source ?? "?",
    run.meta.pollution ?? "P2",
    run.meta.node ?? run.meta.runtime ?? "?",
    run.flags,
  ].join(" ");
}
const setups = [...new Set(runs.map(describeSetup))];

// --- Scenarios -------------------------------------------------------------------

const definitions = new Map(
  SCENARIOS.map((definition) => [
    `${definition.group}|${definition.id}`,
    definition,
  ]),
);

function parseKey(key) {
  const [group, id, size, tags] = key.split(" | ");
  return { group, id, size, tags: tags === undefined ? [] : tags.split(",") };
}

const keys = new Set();
for (const run of runs) {
  for (const key of run.scenarios.keys()) {
    keys.add(key);
  }
}

const copiesSeen = new Set(
  runs.flatMap((run) =>
    [...run.scenarios.values()].flatMap((entries) => Object.keys(entries)),
  ),
);
copiesSeen.delete("native");
const candidates =
  values.candidates === ""
    ? [...copiesSeen]
        .filter((copy) => copy !== BASELINE && copy !== AA)
        .sort((a, b) =>
          a === "branch" ? -1 : b === "branch" ? 1 : a.localeCompare(b),
        )
    : values.candidates.split(",");

const minP75Ms = Number(values["min-p75-us"]) / 1000;

const scenarios = [...keys]
  .map((key) => {
    const parsed = parseKey(key);
    const definition = definitions.get(`${parsed.group}|${parsed.id}`);
    const shape = {
      ...parsed,
      kind: definition?.kind,
      main: definition?.main ?? "?",
    };
    const tierInfo =
      definition === undefined
        ? {
            tier: 3,
            baseTier: 3,
            popularity: "high",
            popularityDefaulted: true,
            unknown: true,
          }
        : tierOf(shape);
    const tier = lowerJitTier ? 3 : tierInfo.tier;
    const perRun = runs
      .filter((run) => run.scenarios.has(key))
      .map((run) => ({ run, entries: run.scenarios.get(key) }));
    const medianOf = (copy, statistic) =>
      distribution(perRun.map((row) => row.entries[copy]?.[statistic]))?.median;
    const fastest = Math.min(
      medianOf(BASELINE, "p75") ?? Infinity,
      medianOf("branch", "p75") ?? Infinity,
    );
    return {
      key,
      ...shape,
      ...tierInfo,
      tier,
      perRun,
      metric: fastest < minP75Ms ? "mean" : "p75",
      medianOf,
    };
  })
  .sort(
    (a, b) =>
      a.tier - b.tier ||
      GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) ||
      a.id.localeCompare(b.id) ||
      SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
  );

/** Per run: candidate/reference on the scenario's metric, p75 and mean. */
function ratiosOf(scenario, candidate, reference = BASELINE) {
  const rows = [];
  for (const { run, entries } of scenario.perRun) {
    const top = entries[candidate];
    const bottom = entries[reference];
    if (top === undefined || bottom === undefined) {
      continue;
    }
    const p75 = bottom.p75 > 0 ? top.p75 / bottom.p75 : undefined;
    const mean = bottom.mean > 0 ? top.mean / bottom.mean : undefined;
    const candidateIndex = run.order.indexOf(candidate);
    const referenceIndex = run.order.indexOf(reference);
    rows.push({
      run: run.name,
      p75,
      mean,
      ratio: scenario.metric === "mean" ? mean : p75,
      candidateFirst:
        candidateIndex !== -1 &&
        referenceIndex !== -1 &&
        candidateIndex < referenceIndex,
    });
  }
  return rows;
}

// The variant report's A/A resampling asks for the same ratios thousands of
// times; this keeps them per (scenario, candidate, reference) as run -> ratio.
const ratioCache = new Map();
function ratioByRun(scenario, candidate, reference) {
  const cacheKey = `${scenario.key}\u0000${candidate}\u0000${reference}`;
  let byRun = ratioCache.get(cacheKey);
  if (byRun === undefined) {
    byRun = new Map(
      ratiosOf(scenario, candidate, reference)
        .filter((row) => row.ratio !== undefined)
        .map((row) => [row.run, row.ratio]),
    );
    ratioCache.set(cacheKey, byRun);
  }
  return byRun;
}

// --- A/A floors and the classifier on A/A ------------------------------------------

const hasAa = scenarios.some((scenario) => ratiosOf(scenario, AA).length > 0);
const floors = {};
for (const tier of TIERS) {
  floors[tier] = noiseFloor(
    scenarios
      .filter((scenario) => scenario.tier === tier)
      .flatMap((scenario) => ratiosOf(scenario, AA).map((row) => row.ratio)),
  );
}
const floorOf = (tier) => floors[tier]?.p95;

function evaluate(scenario, candidate, reference = BASELINE) {
  const rows = ratiosOf(scenario, candidate, reference);
  const verdict = verdictFor(scenario.tier, rows, floorOf(scenario.tier));
  return {
    rows,
    verdict,
    ratio: distribution(rows.map((row) => row.ratio)),
    p75: distribution(rows.map((row) => row.p75)),
    mean: distribution(rows.map((row) => row.mean)),
  };
}

const aaCalls = {};
for (const tier of TIERS) {
  const inTier = scenarios.filter(
    (scenario) => scenario.tier === tier && ratiosOf(scenario, AA).length > 0,
  );
  const calls = inTier
    .map((scenario) => ({ scenario, result: evaluate(scenario, AA) }))
    .filter(({ result }) => result.verdict.verdict !== "neutral");
  aaCalls[tier] = {
    scenarios: inTier.length,
    calls: calls.length,
    bar: calls.filter(({ result }) => violatesBar(result.verdict.verdict))
      .length,
    keys: calls.map(
      ({ scenario, result }) => `${scenario.key} (${result.verdict.verdict})`,
    ),
  };
}

// --- Per candidate, per tier ---------------------------------------------------------

const weightOf = (scenario) => POPULARITY_WEIGHTS[scenario.popularity] ?? 1;

function candidateSummary(candidate, reference = BASELINE) {
  const tiers = {};
  for (const tier of TIERS) {
    const evaluated = scenarios
      .filter((scenario) => scenario.tier === tier)
      .map((scenario) => ({
        scenario,
        ...evaluate(scenario, candidate, reference),
      }))
      .filter((row) => row.ratio !== undefined);
    const counts = {};
    for (const row of evaluated) {
      counts[row.verdict.verdict] = (counts[row.verdict.verdict] ?? 0) + 1;
    }
    tiers[tier] = {
      scenarios: evaluated.length,
      counts,
      regressions: evaluated.filter((row) => violatesBar(row.verdict.verdict))
        .length,
      geomean: geomean(
        evaluated.map((row) => row.ratio.median),
        evaluated.map((row) => weightOf(row.scenario)),
      ),
      unweightedGeomean: geomean(evaluated.map((row) => row.ratio.median)),
      evaluated,
    };
  }
  return { candidate, reference, tiers };
}

const summaries = new Map(
  candidates.map((candidate) => [candidate, candidateSummary(candidate)]),
);
const aaSummary = hasAa ? candidateSummary(AA) : undefined;

// Tolerances for the lexicographic comparison: twice the A/A weighted
// geomean's deviation from 1, at least 0.5%.
const tolerances = {};
for (const tier of TIERS) {
  const aaGeomean = aaSummary?.tiers[tier].geomean;
  tolerances[tier] = Math.max(
    Math.log(1.005),
    aaGeomean === undefined ? 0 : 2 * Math.abs(Math.log(aaGeomean)),
  );
}

// --- Variant report -------------------------------------------------------------------

const variantsIndex = readVariantsIndex();
// The variant report compares each variant copy with the branch; runs without
// a branch copy (e.g. the prepub candidates, judged by
// scripts/prepub-verdicts.mjs against cand-base) get none.
const variantCopies = copiesSeen.has("branch")
  ? candidates.filter((copy) => copy.startsWith("branch-v-"))
  : [];
const draws = Number(values["aa-draws"]);

function variantReport(copy) {
  const variant = variantsIndex.find((candidate) => candidate.copyId === copy);
  const runsWithCopy = runs.filter((run) =>
    [...run.scenarios.values()].some((entries) => entries[copy] !== undefined),
  );
  const measured = scenarios.filter((scenario) =>
    scenario.perRun.some(
      ({ entries }) =>
        entries[copy] !== undefined && entries.branch !== undefined,
    ),
  );
  const flow = measured.filter(
    (scenario) =>
      variant !== undefined &&
      targetMatches(variant.targets, {
        group: scenario.group,
        id: scenario.id,
        size: scenario.size,
      }),
  );
  const perRunRatios = (candidate, reference, scenarioList, invert = false) =>
    runsWithCopy.map((run) =>
      scenarioList
        .map((scenario) => {
          const ratio = ratioByRun(scenario, candidate, reference).get(
            run.name,
          );
          if (ratio === undefined) {
            return undefined;
          }
          return invert ? 1 / ratio : ratio;
        })
        .filter((value) => value !== undefined),
    );
  const sign = signConsistent(perRunRatios(copy, "branch", flow));

  // Tier bars against main, over everything this copy ran.
  const violations = measured
    .map((scenario) => ({ scenario, ...evaluate(scenario, copy) }))
    .filter((row) => violatesBar(row.verdict.verdict))
    .map(
      (row) =>
        `${row.scenario.key} (tier ${row.scenario.tier}: ${row.verdict.verdict} ${row.ratio?.median.toFixed(3)})`,
    );

  // How often the same sign test fires on A/A, on random flows of the same
  // size drawn from what this copy's runs measured, in both directions.
  const aaPool = measured.filter((scenario) =>
    scenario.perRun.some(
      ({ run, entries }) =>
        runsWithCopy.includes(run) &&
        entries[AA] !== undefined &&
        entries[BASELINE] !== undefined,
    ),
  );
  let fired = 0;
  let tried = 0;
  if (flow.length > 0 && aaPool.length >= flow.length) {
    const random = seededRandom(0x5eed + flow.length);
    for (let draw = 0; draw < draws; draw++) {
      const pool = [...aaPool];
      const picked = [];
      for (let index = 0; index < flow.length; index++) {
        picked.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
      }
      for (const invert of [false, true]) {
        tried += 1;
        if (signConsistent(perRunRatios(AA, BASELINE, picked, invert)).fires) {
          fired += 1;
        }
      }
    }
  }
  const aaSameFlow = signConsistent(perRunRatios(AA, BASELINE, flow)).fires;
  const aaRate = tried === 0 ? undefined : fired / tried;
  const passes =
    variant !== undefined &&
    flow.length > 0 &&
    sign.fires &&
    violations.length === 0 &&
    aaRate !== undefined &&
    aaRate < 0.05;
  return {
    copy,
    name: variant?.name ?? copy.replace(/^branch-v-/u, ""),
    description: variant?.description ?? "",
    runs: runsWithCopy.length,
    flow: flow.map((scenario) => scenario.key),
    sign,
    violations,
    aaRate,
    aaSameFlow,
    passes,
    reason: passes
      ? "passes"
      : [
          variant === undefined ? "not in variants/index.json" : undefined,
          flow.length === 0 ? "no target scenario measured" : undefined,
          sign.fires
            ? undefined
            : `sign test: faster in ${sign.fasterRuns}/${sign.runs} runs, geomean ${sign.overall?.toFixed(4) ?? "-"}`,
          violations.length > 0
            ? `${violations.length} tier-bar violations`
            : undefined,
          aaRate !== undefined && aaRate >= 0.05
            ? `A/A fires ${(aaRate * 100).toFixed(1)}%`
            : undefined,
          aaRate === undefined && flow.length > 0 ? "no A/A pool" : undefined,
        ]
          .filter((reason) => reason !== undefined)
          .join("; "),
  };
}

const variantReports = variantCopies.map((copy) => variantReport(copy));

// --- Formatting -------------------------------------------------------------------------

function formatTime(milliseconds) {
  if (milliseconds === undefined) {
    return "-";
  }
  if (milliseconds >= 1) {
    return `${milliseconds.toFixed(2)} ms`;
  }
  if (milliseconds >= 0.001) {
    return `${(milliseconds * 1000).toFixed(2)} us`;
  }
  return `${(milliseconds * 1e6).toFixed(1)} ns`;
}

function formatRatio(value) {
  return value === undefined || !Number.isFinite(value)
    ? "-"
    : value.toFixed(3);
}

function formatDistribution(stats) {
  if (stats === undefined) {
    return "-";
  }
  if (stats.n === 1) {
    return formatRatio(stats.median);
  }
  return `${formatRatio(stats.median)} [${formatRatio(stats.min)}..${formatRatio(stats.max)}]`;
}

function formatPercent(value) {
  return value === undefined ? "-" : `${(value * 100).toFixed(1)}%`;
}

function table(header, rows) {
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function verdictLabel(verdict) {
  const text = `${verdict.verdict}${verdict.note ?? ""}`;
  return verdict.verdict === "neutral" || verdict.verdict === "n/a"
    ? text
    : `**${text}**`;
}

const lines = [];
lines.push(
  `# ${values.title === "" ? "Remeda perf: branch vs main" : values.title}`,
  "",
  "Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. " +
    `Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under ${values["min-p75-us"]} us (marked \`*\`).`,
  "",
);
lines.push(
  table(
    [
      "run",
      "entry order",
      "runner",
      "source",
      "pollution",
      "node",
      "flags",
      "scale",
      "wall",
    ],
    runs.map((run) => [
      run.name,
      run.order.join(","),
      run.runner,
      run.meta.source ?? "?",
      run.meta.pollution ?? "P2",
      run.meta.node ?? run.meta.runtime ?? "?",
      run.flags === "" ? "-" : run.flags,
      String(run.meta.timeScale ?? "?"),
      run.meta.wallMs === undefined
        ? "?"
        : `${(run.meta.wallMs / 1000).toFixed(0)} s`,
    ]),
  ),
  "",
);
const popularity = popularityData();
const defaulted = [
  ...new Set(
    scenarios
      .filter((scenario) => scenario.popularityDefaulted)
      .map((scenario) => scenario.main),
  ),
].sort();
lines.push(
  `Popularity: ${popularity.source === "absent" ? "research/popularity.json is ABSENT, every utility counts as high popularity" : popularity.source}` +
    `${defaulted.length > 0 && popularity.source !== "absent" ? `; defaulted to high (not in the file): ${defaulted.join(", ")}` : ""}.`,
  "",
);
const overrides = tierOverrides();
if (overrides.length > 0) {
  lines.push(
    "Tier overrides (tier-overrides.json; research/popularity.json is untouched):",
    "",
    table(
      [
        "function",
        "kinds",
        "sizes",
        "tier",
        "scenarios changed here",
        "reason",
      ],
      overrides.map((rule) => {
        const changed = scenarios.filter(
          (scenario) =>
            scenario.override?.function === rule.function &&
            scenario.override.tier !== scenario.override.popularityTier,
        );
        return [
          rule.function,
          rule.kinds?.join(",") ?? "all",
          rule.sizes?.join(",") ?? "all",
          String(rule.tier),
          changed.length === 0
            ? "0"
            : `${changed.length}: ${changed.map((scenario) => `${scenario.group} ${scenario.id} ${scenario.size} (${scenario.override.popularityTier} -> ${rule.tier})`).join("; ")}`,
          rule.reason,
        ];
      }),
    ),
    "",
  );
}
if (setups.length > 1) {
  lines.push(
    `WARNING: the runs differ in setup (${setups.map((setup) => `\`${setup}\``).join(" vs ")}); their numbers are pooled anyway.`,
    "",
  );
}
if (lowerJitTier) {
  lines.push(
    "Lower JIT tier runs (--jitless / --max-opt): every scenario is reported as tier 3.",
    "",
  );
}

// Floors.
lines.push("## A/A noise floors and false-call rate", "");
if (hasAa) {
  lines.push(
    "Floor: p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs. False calls: the tier's verdict rule applied to main-aa vs main (anything but neutral is a false call; bar = regression or BLOCK).",
    "",
    table(
      [
        "tier",
        "pairs",
        "median abs dev",
        "p95 abs dev (floor)",
        "max",
        "A/A scenarios",
        "false calls",
        "false bar calls",
      ],
      TIERS.map((tier) => [
        String(tier),
        String(floors[tier]?.n ?? 0),
        formatRatio(floors[tier]?.median),
        formatRatio(floors[tier]?.p95),
        formatRatio(floors[tier]?.max),
        String(aaCalls[tier].scenarios),
        `${aaCalls[tier].calls} (${formatPercent(aaCalls[tier].scenarios === 0 ? undefined : aaCalls[tier].calls / aaCalls[tier].scenarios)})`,
        String(aaCalls[tier].bar),
      ]),
    ),
    "",
  );
  const falseKeys = TIERS.flatMap((tier) => aaCalls[tier].keys);
  if (falseKeys.length > 0) {
    lines.push(`A/A false calls: ${falseKeys.join("; ")}.`, "");
  }
} else {
  lines.push(
    "No main-aa entries were aggregated: there is no A/A floor (tier 1 then flags anything above 1.00 in both orders).",
    "",
  );
}

// Overview per candidate.
lines.push(
  "## Overview (popularity-weighted geomean of the median ratio, verdict counts)",
  "",
);
lines.push(
  `Weights: ${Object.entries(POPULARITY_WEIGHTS)
    .map(([level, weight]) => `${level} ${weight}`)
    .join(", ")}.`,
  "",
);
lines.push(
  table(
    [
      "copy",
      ...TIERS.flatMap((tier) => [`T${tier} gm`, `T${tier} verdicts`]),
      "bar violations",
    ],
    [
      ...summaries.values(),
      ...(aaSummary === undefined ? [] : [aaSummary]),
    ].map((summary) => [
      summary.candidate,
      ...TIERS.flatMap((tier) => [
        formatRatio(summary.tiers[tier].geomean),
        Object.entries(summary.tiers[tier].counts)
          .map(([verdict, count]) => `${verdict} ${count}`)
          .join(", ") || "-",
      ]),
      String(
        TIERS.reduce(
          (total, tier) => total + summary.tiers[tier].regressions,
          0,
        ),
      ),
    ]),
  ),
  "",
);

// Lexicographic comparison.
if (summaries.size > 0) {
  const ranked = [...summaries.values()].sort((a, b) =>
    lexicographicCompare(a, b, tolerances),
  );
  lines.push("## Lexicographic comparison", "");
  lines.push(
    `Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: ${TIERS.map((tier) => `T${tier} ${(Math.expm1(tolerances[tier]) * 100).toFixed(2)}%`).join(", ")}).`,
    "",
    table(
      ["rank", "copy", "T1 regressions", "T1 gm", "T2 gm", "T3 gm", "vs next"],
      ranked.map((summary, index) => {
        const next = ranked[index + 1];
        const comparison =
          next === undefined
            ? undefined
            : lexicographicCompare(summary, next, tolerances);
        return [
          String(index + 1),
          summary.candidate,
          String(summary.tiers[1].regressions),
          formatRatio(summary.tiers[1].geomean),
          formatRatio(summary.tiers[2].geomean),
          formatRatio(summary.tiers[3].geomean),
          comparison === undefined ? "-" : comparison === 0 ? "tie" : "better",
        ];
      }),
    ),
    "",
  );
}

// Variant report.
if (variantReports.length > 0) {
  lines.push("## Variant report (sign-consistent rule)", "");
  lines.push(
    "Pass: faster than branch in every run on the target flow (per-run geomean of variant/branch < 1) with overall geomean <= 0.99, no tier-bar violation against main, and the same test firing on A/A (main-aa vs main, both directions, random flows of the same size) under 5% of the time.",
    "",
    table(
      [
        "variant",
        "runs",
        "flow size",
        "faster runs",
        "flow geomean",
        "bar violations",
        "A/A fire rate",
        "A/A on same flow",
        "result",
      ],
      variantReports.map((report) => [
        report.name,
        String(report.runs),
        String(report.flow.length),
        `${report.sign.fasterRuns}/${report.sign.runs}`,
        formatRatio(report.sign.overall),
        String(report.violations.length),
        formatPercent(report.aaRate),
        report.aaSameFlow ? "fires" : "no",
        report.passes ? "**PASS**" : report.reason,
      ]),
    ),
    "",
  );
  for (const report of variantReports.filter(
    (candidate) => candidate.violations.length > 0,
  )) {
    lines.push(`- ${report.name} violations: ${report.violations.join("; ")}`);
  }
  lines.push("");
}

// Per tier, the branch (or first candidate) in full.
const focus = summaries.get("branch") ?? [...summaries.values()][0];
if (focus !== undefined) {
  const orderLabels = ["copy first", "main first"];
  for (const tier of TIERS) {
    const tierRows = focus.tiers[tier].evaluated;
    if (tierRows.length === 0) {
      continue;
    }
    lines.push(
      `## Tier ${tier}: ${focus.candidate} vs main (${tierRows.length} scenarios, weighted geomean ${formatRatio(focus.tiers[tier].geomean)}, floor ${formatRatio(floorOf(tier))})`,
      "",
    );
    const violating = tierRows.filter((row) =>
      violatesBar(row.verdict.verdict),
    );
    if (violating.length > 0) {
      lines.push(
        `Bar violations: ${violating.map((row) => `${row.scenario.group} ${row.scenario.id} ${row.scenario.size} (${formatRatio(row.ratio.median)})`).join("; ")}.`,
        "",
      );
    }
    lines.push(
      table(
        [
          "scenario",
          "size",
          "pop",
          "main",
          focus.candidate,
          "ratio p75",
          "ratio mean",
          ...orderLabels,
          "main-aa/main",
          "native/main",
          "verdict",
        ],
        tierRows.map((row) => {
          const scenario = row.scenario;
          const aa = distribution(
            ratiosOf(scenario, AA).map((aaRow) => aaRow.ratio),
          );
          const native = distribution(
            ratiosOf(scenario, "native").map((nativeRow) => nativeRow.ratio),
          );
          const candidateFirst = distribution(
            row.rows
              .filter((ratioRow) => ratioRow.candidateFirst)
              .map((ratioRow) => ratioRow.ratio),
          );
          const mainFirst = distribution(
            row.rows
              .filter((ratioRow) => !ratioRow.candidateFirst)
              .map((ratioRow) => ratioRow.ratio),
          );
          return [
            `${scenario.group} ${scenario.id}`,
            scenario.size,
            `${scenario.popularity}${scenario.popularityDefaulted ? "?" : ""}${scenario.override === undefined ? "" : " (override)"}`,
            formatTime(scenario.medianOf(BASELINE, "p75")),
            formatTime(scenario.medianOf(focus.candidate, "p75")),
            `${formatDistribution(row.p75)}${scenario.metric === "p75" ? "" : ""}`,
            `${formatDistribution(row.mean)}${scenario.metric === "mean" ? " *" : ""}`,
            formatRatio(candidateFirst?.median),
            formatRatio(mainFirst?.median),
            formatDistribution(aa),
            formatRatio(native?.median),
            verdictLabel(row.verdict),
          ];
        }),
      ),
      "",
    );
    for (const [candidate, summary] of summaries) {
      if (candidate === focus.candidate) {
        continue;
      }
      const flagged = summary.tiers[tier].evaluated.filter(
        (row) => row.verdict.verdict !== "neutral",
      );
      if (flagged.length > 0) {
        lines.push(
          `${candidate} (tier ${tier}, non-neutral): ${flagged
            .map(
              (row) =>
                `${row.scenario.group} ${row.scenario.id} ${row.scenario.size} ${row.verdict.verdict} ${formatRatio(row.ratio.median)}`,
            )
            .join("; ")}.`,
          "",
        );
      }
    }
  }
}

// Trap counts from a validation report.
let traps;
if (values.validate !== "" && existsSync(values.validate)) {
  traps = JSON.parse(readFileSync(values.validate, "utf8")).traps ?? [];
  if (traps.length > 0) {
    lines.push(
      "## Proxy trap counts per copy (from validation, one measured call)",
      "",
    );
    const labels = [
      ...new Set(traps.flatMap((row) => Object.keys(row.counts))),
    ];
    lines.push(
      table(
        ["scenario", ...labels.map((label) => `${label} has/get`)],
        traps.map((row) => [
          row.key,
          ...labels.map((label) =>
            row.counts[label] === undefined
              ? "-"
              : `${row.counts[label].has}/${row.counts[label].get}`,
          ),
        ]),
      ),
      "",
    );
  }
}

// Per-run details.
const details = ["# Per-run details", ""];
const copyColumns = [...copiesSeen, "native"].filter((copy) =>
  runs.some((run) =>
    [...run.scenarios.values()].some((entries) => entries[copy] !== undefined),
  ),
);
details.push(
  table(
    [
      "scenario",
      "size",
      "tier",
      "run",
      ...copyColumns.flatMap((copy) => [`${copy} p75`, `${copy} mean`]),
    ],
    scenarios.flatMap((scenario) =>
      scenario.perRun.map(({ run, entries }) => [
        `${scenario.group} ${scenario.id}`,
        scenario.size,
        String(scenario.tier),
        run.name,
        ...copyColumns.flatMap((copy) => [
          formatTime(entries[copy]?.p75),
          formatTime(entries[copy]?.mean),
        ]),
      ]),
    ),
  ),
  "",
);

const survivors = variantReports
  .filter((report) => report.passes)
  .map((report) => report.name);
if (values["survivors-out"] !== "") {
  writeFileSync(
    values["survivors-out"],
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        runs: runs.map((run) => run.name),
        survivors,
        reports: variantReports,
      },
      undefined,
      2,
    )}\n`,
  );
}

writeFileSync(`${values.out}.md`, `${lines.join("\n")}\n`);
writeFileSync(`${values.out}.details.md`, `${details.join("\n")}\n`);
writeFileSync(
  `${values.out}.json`,
  `${JSON.stringify(
    {
      runs: runs.map(({ name, file, order, meta }) => ({
        name,
        file,
        order,
        meta,
      })),
      setups,
      lowerJitTier,
      popularity: popularity.source,
      overrides,
      floors,
      aaFalseCalls: aaCalls,
      tolerances,
      candidates: Object.fromEntries(
        [
          ...summaries,
          ...(aaSummary === undefined ? [] : [[AA, aaSummary]]),
        ].map(([candidate, summary]) => [
          candidate,
          Object.fromEntries(
            TIERS.map((tier) => [
              tier,
              {
                scenarios: summary.tiers[tier].scenarios,
                counts: summary.tiers[tier].counts,
                regressions: summary.tiers[tier].regressions,
                geomean: summary.tiers[tier].geomean,
                unweightedGeomean: summary.tiers[tier].unweightedGeomean,
                rows: summary.tiers[tier].evaluated.map((row) => ({
                  key: row.scenario.key,
                  metric: row.scenario.metric,
                  popularity: row.scenario.popularity,
                  ratio: row.ratio,
                  p75: row.p75,
                  mean: row.mean,
                  verdict: row.verdict,
                  perRun: row.rows,
                })),
              },
            ]),
          ),
        ]),
      ),
      variants: variantReports,
      survivors,
      traps,
    },
    undefined,
    2,
  )}\n`,
);

process.stdout.write(
  `[aggregate] ${runs.length} runs, ${scenarios.length} scenarios, candidates ${candidates.join(",") || "-"} -> ${values.out}.md, ${values.out}.details.md, ${values.out}.json` +
    `${variantReports.length > 0 ? `; variants passing: ${survivors.join(",") || "none"}` : ""}\n`,
);
