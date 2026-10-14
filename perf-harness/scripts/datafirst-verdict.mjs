// Verdict of stage datafirst (stages/datafirst.steps): the branch at 3065f5be
// with plain eager data-first implementations for the 8 utilities that only
// had lazy code (unique, uniqueBy, uniqueWith, difference, differenceWith,
// intersection, intersectionWith, mapWithFeedback) and purryFromLazy deleted
// (variants/datafirst.patch, copy branch-v-datafirst).
//
//   node scripts/datafirst-verdict.mjs [--dir results/datafirst] [--aa-draws 2000]
//
// Inputs (under --dir): conf-r*.json (the confirmation runs) and bundle.json
// (scripts/bundle-size.mjs --set datafirst). Writes <dir>/verdict.md and
// <dir>/verdict.json. Sections:
//   1. per function, its data-first (G5) scenarios: new vs branch and new vs
//      main, geomean per run and overall, sign count and the sign test in
//      both directions; then every scenario's median and tier verdict;
//   2. the lazy path (G1b, the same 8 functions in `pipe`): new vs branch,
//      which should read neutral since the lazy code is unchanged;
//   3. tier bars vs main (branch and new), and the tier 1 losses vs the
//      branch;
//   4. bundle bytes per import set, and whether the sentinel is bundled;
//   5. the rule: adopt when there is no tier 1 loss vs the branch and no
//      tier-bar violation vs main.
// Loading and the tier rules are those of scripts/slimarity-verdict.mjs.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { SCENARIOS } from "../harness/scenarios.js";
import { POPULARITY_WEIGHTS, tierOf } from "../harness/tiers.js";
import {
  distribution,
  geomean,
  noiseFloor,
  seededRandom,
  signConsistent,
  verdictFor,
  violatesBar,
} from "../harness/verdicts.js";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const { values } = parseArgs({
  options: {
    dir: { type: "string", default: "results/datafirst" },
    "aa-draws": { type: "string", default: "2000" },
  },
});
const DIR = path.resolve(PERF_DIR, values.dir);
const DRAWS = Number(values["aa-draws"]);
const TIERS = [1, 2, 3];
const MAIN = "main";
const AA = "main-aa";
const BRANCH = "branch";
const NEW = "branch-v-datafirst";
const FUNCTIONS = [
  "unique",
  "uniqueBy",
  "uniqueWith",
  "difference",
  "differenceWith",
  "intersection",
  "intersectionWith",
  "mapWithFeedback",
];
const label = (copy) => (copy === NEW ? "new" : copy);

const fmt = (value, digits = 3) =>
  value === undefined || !Number.isFinite(value) ? "-" : value.toFixed(digits);
const signed = (value) => (value > 0 ? `+${value}` : String(value));
const shortKey = (key) =>
  key
    .replace(/ \| (headline|data-first-guard|traps)(,[\w-]+)*$/u, "")
    .replaceAll(" | ", " ");
const table = (header, rows) =>
  [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
const readJson = (file) =>
  existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : undefined;

// --- Loading (as scripts/slimarity-verdict.mjs) -----------------------------

const definitions = new Map(
  SCENARIOS.map((definition) => [
    `${definition.group}|${definition.id}`,
    definition,
  ]),
);

function loadRuns(directory, pattern) {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory)
    .filter((file) => pattern.test(file))
    .sort()
    .map((file) => {
      const full = path.join(directory, file);
      const json = JSON.parse(readFileSync(full, "utf8"));
      const meta = readJson(full.replace(/\.json$/u, ".meta.json")) ?? {};
      const scenarios = new Map();
      for (const benchFile of json.files ?? []) {
        for (const group of benchFile.groups) {
          const key = group.fullName.split(" > ").at(-1);
          const entries = scenarios.get(key) ?? {};
          for (const benchmark of group.benchmarks) {
            entries[benchmark.name] = {
              p75: benchmark.p75,
              mean: benchmark.mean,
            };
          }
          scenarios.set(key, entries);
        }
      }
      return {
        name: meta.name ?? file,
        order: meta.order ?? [],
        meta,
        scenarios,
      };
    });
}

function buildScenarios(runs) {
  const keys = new Set(runs.flatMap((run) => [...run.scenarios.keys()]));
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
    const info =
      definition === undefined
        ? { tier: 3, popularity: "high" }
        : tierOf(shape);
    const perRun = runs
      .filter((run) => run.scenarios.has(key))
      .map((run) => ({ run, entries: run.scenarios.get(key) }));
    const medianP75 = (copy) =>
      distribution(perRun.map((row) => row.entries[copy]?.p75))?.median ??
      Infinity;
    return {
      key,
      ...shape,
      tier: info.tier,
      weight: POPULARITY_WEIGHTS[info.popularity] ?? 1,
      // A p75 under 1 us is at the timer's resolution; the mean isn't.
      metric:
        Math.min(...[MAIN, BRANCH, NEW].map(medianP75)) < 0.001
          ? "mean"
          : "p75",
      perRun,
    };
  });
}

function ratiosOf(scenario, candidate, reference) {
  const rows = [];
  for (const { run, entries } of scenario.perRun) {
    const top = entries[candidate];
    const bottom = entries[reference];
    if (top === undefined || bottom === undefined) {
      continue;
    }
    const ratio =
      scenario.metric === "mean"
        ? top.mean / bottom.mean
        : top.p75 / bottom.p75;
    if (!Number.isFinite(ratio) || ratio <= 0) {
      continue;
    }
    const candidateIndex = run.order.indexOf(candidate);
    const referenceIndex = run.order.indexOf(reference);
    rows.push({
      run: run.name,
      ratio,
      candidateFirst:
        candidateIndex !== -1 &&
        referenceIndex !== -1 &&
        candidateIndex < referenceIndex,
    });
  }
  return rows;
}

function floorsOf(scenarios) {
  return Object.fromEntries(
    TIERS.map((tier) => [
      tier,
      noiseFloor(
        scenarios
          .filter((scenario) => scenario.tier === tier)
          .flatMap((scenario) =>
            ratiosOf(scenario, AA, MAIN).map((row) => row.ratio),
          ),
      ),
    ]),
  );
}

function evaluate(scenario, candidate, reference, floors) {
  const rows = ratiosOf(scenario, candidate, reference);
  if (rows.length === 0) {
    return undefined;
  }
  const verdict = verdictFor(scenario.tier, rows, floors[scenario.tier]?.p95);
  return {
    scenario,
    rows,
    median: distribution(rows.map((row) => row.ratio)).median,
    candidateFirst: distribution(
      rows.filter((row) => row.candidateFirst).map((row) => row.ratio),
    )?.median,
    referenceFirst: distribution(
      rows.filter((row) => !row.candidateFirst).map((row) => row.ratio),
    )?.median,
    verdict: verdict.verdict,
    note: verdict.note ?? "",
    bar: violatesBar(verdict.verdict),
  };
}

function compare(scenarios, candidate, reference, floors) {
  const evaluated = scenarios
    .map((scenario) => evaluate(scenario, candidate, reference, floors))
    .filter((row) => row !== undefined);
  const tiers = {};
  for (const tier of TIERS) {
    const rows = evaluated.filter((row) => row.scenario.tier === tier);
    const counts = {};
    for (const row of rows) {
      counts[row.verdict] = (counts[row.verdict] ?? 0) + 1;
    }
    tiers[tier] = {
      n: rows.length,
      geomean: geomean(
        rows.map((row) => row.median),
        rows.map((row) => row.scenario.weight),
      ),
      counts,
    };
  }
  return { evaluated, tiers, bars: evaluated.filter((row) => row.bar) };
}

const describeRow = (row) =>
  `T${row.scenario.tier} ${shortKey(row.scenario.key)} ${fmt(row.median)} (${fmt(row.candidateFirst)} / ${fmt(row.referenceFirst)})${row.note}`;
const tierCell = (summary, tier) =>
  summary.tiers[tier].n === 0
    ? "-"
    : `${fmt(summary.tiers[tier].geomean)} (${summary.tiers[tier].n}; ${Object.entries(
        summary.tiers[tier].counts,
      )
        .map(([verdict, count]) => `${verdict} ${count}`)
        .join(", ")})`;
const verdictCell = (row) =>
  row === undefined
    ? "-"
    : `${fmt(row.median)} (${fmt(row.candidateFirst)} / ${fmt(row.referenceFirst)}) ${row.verdict}${row.note}`;

/** Per run, the ratios of `list`'s scenarios (inverted: reference/candidate). */
function perRunRatios(runs, list, candidate, reference, invert = false) {
  return runs.map((run) =>
    list
      .map((scenario) => {
        const row = ratiosOf(scenario, candidate, reference).find(
          (candidateRow) => candidateRow.run === run.name,
        );
        if (row === undefined) {
          return undefined;
        }
        return invert ? 1 / row.ratio : row.ratio;
      })
      .filter((value) => value !== undefined),
  );
}

/**
 * How often the sign test fires on A/A (main-aa vs main, both directions) for
 * random flows of `size` scenarios drawn from `pool`.
 */
function aaFireRate(runs, pool, size) {
  if (size === 0 || pool.length < size) {
    return undefined;
  }
  let fired = 0;
  let tried = 0;
  const random = seededRandom(0x5e_ed + size);
  for (let draw = 0; draw < DRAWS; draw++) {
    const remaining = [...pool];
    const picked = [];
    for (let pick = 0; pick < size; pick++) {
      picked.push(
        remaining.splice(Math.floor(random() * remaining.length), 1)[0],
      );
    }
    for (const invert of [false, true]) {
      tried += 1;
      if (signConsistent(perRunRatios(runs, picked, AA, MAIN, invert)).fires) {
        fired += 1;
      }
    }
  }
  return fired / tried;
}

/** Geomean per run and overall of candidate/reference over `list`. */
function flowLine(runs, list, candidate, reference) {
  const sign = signConsistent(perRunRatios(runs, list, candidate, reference));
  const inverse = signConsistent(
    perRunRatios(runs, list, candidate, reference, true),
  );
  return {
    n: list.length,
    perRun: sign.perRun,
    overall: sign.overall,
    fasterRuns: sign.fasterRuns,
    slowerRuns: sign.perRun.filter((value) => value > 1).length,
    runs: sign.runs,
    fires: sign.fires,
    mirroredFires: inverse.fires,
    reading: sign.fires
      ? "FASTER (sign test fires)"
      : inverse.fires
        ? "SLOWER (mirrored sign test fires)"
        : "no consistent difference",
  };
}

const flowCells = (line) => [
  String(line.n),
  line.perRun.map((value) => fmt(value)).join(", ") || "-",
  fmt(line.overall, 4),
  `${line.fasterRuns} faster / ${line.slowerRuns} slower of ${line.runs}`,
  line.reading,
];
const FLOW_HEADER = ["n", "gm per run", "overall", "sign count", "reading"];

// --- Report -----------------------------------------------------------------

const out = { generatedAt: new Date().toISOString(), dir: values.dir };
const lines = [
  "# Stage datafirst: verdict",
  "",
  `Generated by scripts/datafirst-verdict.mjs from ${values.dir}. new = branch-v-datafirst: the branch (3065f5be) with plain eager data-first implementations for ${FUNCTIONS.join(", ")} (purryWithLazy instead of purryFromLazy; the lazy implementations unchanged). Ratios are copy/reference (< 1 = faster); per-scenario ratios use p75 (mean below 1 us); gm = geomean (tier geomeans are popularity-weighted: high 4, mid 2, low 1). Cells "m (a / b)" read: median, then the medians of the runs where the copy ran first / the reference ran first.`,
  "",
];

const runs = loadRuns(DIR, /^conf-r\d+\.json$/u);
const scenarios = buildScenarios(runs);
const floors = floorsOf(scenarios);
let decision;

if (runs.length === 0) {
  lines.push(
    "No confirmation runs (conf-r*.json): sections 1, 2 and 3 skipped.",
    "",
  );
} else {
  const isTarget = (scenario, group, name) =>
    scenario.group === group &&
    (name === undefined
      ? FUNCTIONS.includes(scenario.main)
      : scenario.main === name);
  const dataFirstFlow = scenarios.filter((scenario) =>
    isTarget(scenario, "G5"),
  );
  const lazyFlow = scenarios.filter((scenario) => isTarget(scenario, "G1b"));
  const aaFalseCalls = compare(scenarios, AA, MAIN, floors).evaluated.filter(
    (row) => row.verdict !== "neutral",
  );
  const aaPool = scenarios.filter(
    (scenario) => ratiosOf(scenario, AA, MAIN).length > 0,
  );
  out.runs = runs.map((run) => ({ name: run.name, order: run.order }));
  out.floors = Object.fromEntries(
    TIERS.map((tier) => [tier, floors[tier]?.p95]),
  );
  lines.push(
    `Confirmation: ${runs.length} runs (${runs.map((run) => run.order.map(label).join(",")).join(" / ")}), ${scenarios.length} scenarios (${dataFirstFlow.length} data-first and ${lazyFlow.length} pipe scenarios of the 8 functions, the rest from the T1G guard). A/A floors (p95 |main-aa/main - 1|): ${TIERS.map((tier) => `T${tier} ${fmt(floors[tier]?.p95)}`).join(", ")}. A/A false calls: ${aaFalseCalls.length}${aaFalseCalls.length > 0 ? ` (${aaFalseCalls.map((row) => `${describeRow(row)} ${row.verdict}`).join("; ")})` : ""}.`,
    "",
  );

  // 1. Data-first, per function.
  const functionFlows = (group) =>
    FUNCTIONS.map((name) => [
      name,
      scenarios.filter((scenario) => isTarget(scenario, group, name)),
    ]);
  const dataFirstRows = (reference) => [
    ...functionFlows("G5").map(([name, list]) => [
      name,
      ...flowCells(flowLine(runs, list, NEW, reference)),
    ]),
    ["**all 8**", ...flowCells(flowLine(runs, dataFirstFlow, NEW, reference))],
  ];
  const aaRateDataFirst = aaFireRate(runs, aaPool, dataFirstFlow.length);
  out.dataFirst = {
    vsBranch: Object.fromEntries(
      functionFlows("G5").map(([name, list]) => [
        name,
        flowLine(runs, list, NEW, BRANCH),
      ]),
    ),
    vsMain: Object.fromEntries(
      functionFlows("G5").map(([name, list]) => [
        name,
        flowLine(runs, list, NEW, MAIN),
      ]),
    ),
  };
  lines.push(
    "## 1. Data-first (G5) per function",
    "",
    `Each function's flow is its G5 scenarios at every size run (XS/S/C/M; none of them defines Mx64), including \`difference(range)\` (adopter shape) under difference and the \`(reads data)\` callbacks under uniqueBy and mapWithFeedback. Sign test: faster in every run and overall gm <= 0.99. A/A fire rate of the sign test on random flows of ${dataFirstFlow.length} (both directions): ${aaRateDataFirst === undefined ? "-" : `${(aaRateDataFirst * 100).toFixed(1)}%`}.`,
    "",
    "### new vs branch",
    "",
    table(["function", ...FLOW_HEADER], dataFirstRows(BRANCH)),
    "",
    "### new vs main",
    "",
    table(["function", ...FLOW_HEADER], dataFirstRows(MAIN)),
    "",
    "### Per scenario",
    "",
    table(
      ["scenario", "tier", "new/branch", "new/main", "branch/main"],
      [...dataFirstFlow]
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((scenario) => [
          shortKey(scenario.key),
          `T${scenario.tier}`,
          verdictCell(evaluate(scenario, NEW, BRANCH, floors)),
          verdictCell(evaluate(scenario, NEW, MAIN, floors)),
          verdictCell(evaluate(scenario, BRANCH, MAIN, floors)),
        ]),
    ),
    "",
  );

  // 2. The lazy path: unchanged code, so it should read neutral.
  const lazyVsBranch = compare(lazyFlow, NEW, BRANCH, floors);
  const lazyLine = flowLine(runs, lazyFlow, NEW, BRANCH);
  const aaRateLazy = aaFireRate(runs, aaPool, lazyFlow.length);
  out.lazy = {
    overall: lazyLine,
    losses: lazyVsBranch.bars.map((row) => describeRow(row)),
  };
  lines.push(
    "## 2. Lazy path (G1b) new vs branch",
    "",
    `The lazy implementations are unchanged, so \`pipe(data, fn(...))\` and \`pipe(data, fn(...), map(...))\` should show no consistent difference; the data-last function itself is now built by lazyDataLastImpl instead of purryFromLazy. A/A fire rate of the sign test on random flows of ${lazyFlow.length}: ${aaRateLazy === undefined ? "-" : `${(aaRateLazy * 100).toFixed(1)}%`}.`,
    "",
    table(
      ["function", ...FLOW_HEADER],
      [
        ...functionFlows("G1b").map(([name, list]) => [
          name,
          ...flowCells(flowLine(runs, list, NEW, BRANCH)),
        ]),
        ["**all 8**", ...flowCells(lazyLine)],
      ],
    ),
    "",
    `Tier-rule losses on the lazy flow vs the branch: ${lazyVsBranch.bars.length === 0 ? "none" : lazyVsBranch.bars.map((row) => describeRow(row)).join("; ")}. Tier geomeans: ${TIERS.map((tier) => `T${tier} ${tierCell(lazyVsBranch, tier)}`).join("; ")}.`,
    "",
    `Neutrality (all 8): ${
      lazyLine.mirroredFires || lazyVsBranch.bars.length > 0
        ? "NOT neutral, slower (the mirrored sign test fires or a tier rule loses; see above)"
        : lazyLine.fires
          ? "not neutral but in the new copy's favor (the sign test fires; no tier-rule loss)"
          : "neutral (no sign test fires in either direction, no tier-rule loss)"
    }.`,
    "",
  );

  // 3. Tier bars vs main, and tier 1 losses vs the branch.
  const branchVsMain = compare(scenarios, BRANCH, MAIN, floors);
  const newVsMain = compare(scenarios, NEW, MAIN, floors);
  const newVsBranch = compare(scenarios, NEW, BRANCH, floors);
  const tier1LossesVsBranch = newVsBranch.bars.filter(
    (row) => row.scenario.tier === 1,
  );
  const otherLossesVsBranch = newVsBranch.bars.filter(
    (row) => row.scenario.tier !== 1,
  );
  out.barsVsMain = newVsMain.bars.map((row) => describeRow(row));
  out.tier1LossesVsBranch = tier1LossesVsBranch.map((row) => describeRow(row));
  lines.push(
    "## 3. Tier bars vs main; tier 1 losses vs the branch",
    "",
    "Over every scenario in the runs (targets and the T1G guard). Tier 1: regression when the median is beyond 1 + floor in both orders. Tier 2: median >= 1.05, every run > 1.00 and median - 1 beyond the floor. Tier 3: report only, BLOCK when every run is >= 1.25.",
    "",
    table(
      ["copy", "T1 vs main", "T2 vs main", "T3 vs main", "bar violations"],
      [
        [BRANCH, branchVsMain],
        [NEW, newVsMain],
      ].map(([copy, summary]) => [
        label(copy),
        ...TIERS.map((tier) => tierCell(summary, tier)),
        summary.bars.length === 0
          ? "none"
          : summary.bars.map((row) => describeRow(row)).join("; "),
      ]),
    ),
    "",
    `Tier geomeans new vs branch: ${TIERS.map((tier) => `T${tier} ${tierCell(newVsBranch, tier)}`).join("; ")}.`,
    "",
    `Tier 1 losses vs the branch: ${tier1LossesVsBranch.length === 0 ? "none" : tier1LossesVsBranch.map((row) => describeRow(row)).join("; ")}.`,
    "",
    `Tier 2/3 losses vs the branch (not part of the rule): ${otherLossesVsBranch.length === 0 ? "none" : otherLossesVsBranch.map((row) => describeRow(row)).join("; ")}.`,
    "",
  );

  decision = {
    tier1LossesVsBranch: tier1LossesVsBranch.length,
    barsVsMain: newVsMain.bars.length,
  };
}

// 4. Bundle bytes.
const bundle = readJson(path.join(DIR, "bundle.json"));
lines.push("## 4. Bundle bytes per import set", "");
if (bundle === undefined) {
  lines.push("No bundle.json (scripts/bundle-size.mjs --set datafirst).", "");
} else {
  const bytes = (stats) =>
    stats === undefined
      ? "-"
      : `${stats.minified} / ${stats.gzip} / ${stats.brotli}`;
  const delta = (stats, reference) =>
    stats === undefined || reference === undefined
      ? "-"
      : `${signed(stats.minified - reference.minified)} / ${signed(stats.gzip - reference.gzip)} / ${signed(stats.brotli - reference.brotli)}`;
  const sentinel = (stats) =>
    stats === undefined
      ? "-"
      : stats.hasSentinelMessage || stats.hasProxy
        ? "yes"
        : "no";
  out.bundle = bundle.rows;
  lines.push(
    'Bytes are minified / gzip / brotli of a minified ESM bundle of the import set against each copy\'s dist. "sentinel" is whether the bundle holds the UNEXPECTED_ACCESS_SENTINEL (its "unexpected access to a callback" message or its Proxy).',
    "",
    table(
      [
        "import set",
        "bundler",
        "main",
        "branch",
        "new",
        "new - branch",
        "new - main",
        "sentinel main / branch / new",
      ],
      bundle.rows.map((row) => [
        row.entry,
        row.bundler,
        bytes(row[MAIN]),
        bytes(row[BRANCH]),
        bytes(row[NEW]),
        delta(row[NEW], row[BRANCH]),
        delta(row[NEW], row[MAIN]),
        `${sentinel(row[MAIN])} / ${sentinel(row[BRANCH])} / ${sentinel(row[NEW])}`,
      ]),
    ),
    "",
  );
}

// 5. The rule.
lines.push("## 5. Rule", "");
if (decision === undefined) {
  lines.push("**Rule: undecided** (no confirmation runs).");
} else {
  const adopt = decision.tier1LossesVsBranch === 0 && decision.barsVsMain === 0;
  out.adopt = adopt;
  lines.push(
    `Adopt when there is no tier 1 loss vs the branch and no tier-bar violation vs main: ${decision.tier1LossesVsBranch} tier 1 loss(es) vs the branch, ${decision.barsVsMain} tier-bar violation(s) vs main.`,
    "",
    adopt
      ? "**Rule: ADOPT** datafirst (no tier 1 loss vs the branch, no tier-bar violation vs main)."
      : "**Rule: DO NOT ADOPT** datafirst as measured (see section 3).",
  );
}

const mdFile = path.join(DIR, "verdict.md");
writeFileSync(mdFile, `${lines.join("\n")}\n`);
writeFileSync(
  path.join(DIR, "verdict.json"),
  `${JSON.stringify(out, undefined, 2)}\n`,
);
process.stdout.write(`${lines.join("\n")}\n\n[datafirst-verdict] ${mdFile}\n`);
