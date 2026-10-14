// Verdict of stage slimarity (stages/slimarity.steps): the branch at 2fab5832
// with lazyDataLastImpl slimmed to a dedicated closure for one stored argument
// (slim1) or for none and one (slim01), the spread otherwise.
//
//   node scripts/slimarity-verdict.mjs [--dir results/slimarity]
//     [--noarity-dir results/noarity] [--aa-draws 2000]
//
// Inputs (under --dir): conf-r*.json (the confirmation runs), jitless-r*.json
// and maxopt1-r*.json (the lower JIT tiers), bundle.json. noarity's numbers
// come from its own stage's runs under --noarity-dir, judged with that
// stage's floors. Writes <dir>/verdict.md and <dir>/verdict.json. Sections:
//   1. each variant's target flow vs the branch: geomean per run and overall,
//      sign count, the sign test in both directions, tier-rule losses;
//   2. tier bars vs main (and the clamp data-last C line);
//   3. the G3 scalar purry and pipe(x, add(1)) rows, beside noarity's;
//   4. the lower JIT tiers vs the branch (and vs main);
//   5. the rule: adoptable = no tier 1 loss vs the branch beyond the floor and
//      no tier-bar violation vs main; the adoptable ones ranked by bytes saved;
//   6. bundle bytes per import set.
// Loading and the tier rules are those of scripts/prepub-verdicts.mjs.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { readVariantsIndex, targetMatches } from "../harness/copies.js";
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
    dir: { type: "string", default: "results/slimarity" },
    "noarity-dir": { type: "string", default: "results/noarity" },
    "aa-draws": { type: "string", default: "2000" },
  },
});
const DIR = path.resolve(PERF_DIR, values.dir);
const NOARITY_DIR = path.resolve(PERF_DIR, values["noarity-dir"]);
const DRAWS = Number(values["aa-draws"]);
const TIERS = [1, 2, 3];
const MAIN = "main";
const AA = "main-aa";
const BRANCH = "branch";
const SLIM1 = "branch-v-slim1";
const SLIM01 = "branch-v-slim01";
const NOARITY = "branch-v-noarity";
const SLIMS = [SLIM1, SLIM01];
const label = (copy) => copy.replace("branch-v-", "");
// The rows noarity lost on: data-last purry calls in scalar pipes.
const isFocusRow = (scenario) =>
  scenario.group === "G3" &&
  (scenario.id === "pipe(x, add(1))" ||
    scenario.id.startsWith("scalar purry depth-"));
// Ranking key for the adoptable variants (ties: gzip).
const RANK_ENTRY = "import { map }";
const RANK_BUNDLER = "esbuild";

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

// --- Loading (as scripts/prepub-verdicts.mjs) ------------------------------------

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
        flags: (meta.nodeFlags ?? []).join(" "),
        meta,
        scenarios,
      };
    });
}

function buildScenarios(runs, candidates) {
  const lowerJit = runs.some((run) => /--jitless|--max-opt/u.test(run.flags));
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
      tier: lowerJit ? 3 : info.tier,
      weight: POPULARITY_WEIGHTS[info.popularity] ?? 1,
      // A p75 under 1 us is at the timer's resolution; the mean isn't.
      metric:
        Math.min(...[MAIN, BRANCH, ...candidates].map(medianP75)) < 0.001
          ? "mean"
          : "p75",
      perRun,
    };
  });
}

function ratiosOf(scenario, candidate, reference, metric = scenario.metric) {
  const rows = [];
  for (const { run, entries } of scenario.perRun) {
    const top = entries[candidate];
    const bottom = entries[reference];
    if (top === undefined || bottom === undefined) {
      continue;
    }
    const ratio =
      metric === "mean" ? top.mean / bottom.mean : top.p75 / bottom.p75;
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
];

/**
 * One stage's confirmation, judged as that stage judges it: its own scenarios
 * and A/A floors.
 */
function confirmationOf(directory, candidates) {
  const runs = loadRuns(directory, /^conf-r\d+\.json$/u);
  if (runs.length === 0) {
    return undefined;
  }
  const scenarios = buildScenarios(runs, candidates);
  return { runs, scenarios, floors: floorsOf(scenarios) };
}

const index = readVariantsIndex();
const targetsOf = (copy) =>
  index.find((variant) => variant.copyId === copy)?.targets;

/** Everything the rule and the tables need for one copy in one stage. */
function judge(stage, copy) {
  const { runs, scenarios, floors } = stage;
  const flow = scenarios.filter(
    (scenario) =>
      targetMatches(targetsOf(copy), scenario) &&
      ratiosOf(scenario, copy, BRANCH).length > 0,
  );
  const vsBranch = compare(scenarios, copy, BRANCH, floors);
  const vsMain = compare(scenarios, copy, MAIN, floors);
  return {
    copy,
    flow,
    flowLine: flowLine(runs, flow, copy, BRANCH),
    groups: ["G3", "G6", "G7", "G10"].map((group) => [
      group === "G7" ? "G7 data-last" : group,
      flowLine(
        runs,
        flow.filter((scenario) => scenario.group === group),
        copy,
        BRANCH,
      ),
    ]),
    vsBranch,
    vsMain,
    tier1Losses: vsBranch.bars.filter((row) => row.scenario.tier === 1),
    otherLosses: vsBranch.bars.filter((row) => row.scenario.tier !== 1),
  };
}

// --- Report ---------------------------------------------------------------------

const out = { generatedAt: new Date().toISOString(), dir: values.dir };
const lines = [
  "# Stage slimarity: verdict",
  "",
  `Generated by scripts/slimarity-verdict.mjs from ${values.dir} (noarity: ${values["noarity-dir"]}, judged with its own stage's floors). slim1 = the branch (2fab5832) with lazyDataLastImpl keeping a dedicated closure only for one stored argument, slim01 = for none and one; both spread otherwise and keep the direct lazy/lazyArgs writes. noarity = the single spread closure everywhere. Ratios are copy/reference (< 1 = faster); per-scenario ratios use p75 (mean below 1 us); gm = geomean (tier geomeans are popularity-weighted: high 4, mid 2, low 1).`,
  "",
];

const stage = confirmationOf(DIR, SLIMS);
const noarityStage = confirmationOf(NOARITY_DIR, [NOARITY]);
const judged =
  stage === undefined
    ? {}
    : Object.fromEntries(SLIMS.map((copy) => [copy, judge(stage, copy)]));
const noarity =
  noarityStage === undefined ? undefined : judge(noarityStage, NOARITY);
out.confirmationRuns = stage?.runs.map((run) => ({
  name: run.name,
  order: run.order,
}));

if (stage === undefined) {
  lines.push(
    "No confirmation runs (conf-r*.json): sections 1, 2, 3 and 5 skipped.",
    "",
  );
} else {
  const { runs, scenarios, floors } = stage;
  const aaFalseCalls = compare(scenarios, AA, MAIN, floors).evaluated.filter(
    (row) => row.verdict !== "neutral",
  );
  const aaPool = scenarios.filter(
    (scenario) => ratiosOf(scenario, AA, MAIN).length > 0,
  );
  const flowSize = judged[SLIM1].flow.length;
  const aaRate = aaFireRate(runs, aaPool, flowSize);
  out.floors = Object.fromEntries(
    TIERS.map((tier) => [tier, floors[tier]?.p95]),
  );
  lines.push(
    `Confirmation: ${runs.length} runs (${runs.map((run) => run.order.map(label).join(",")).join(" / ")}), ${scenarios.length} scenarios. A/A floors (p95 |main-aa/main - 1|): ${TIERS.map((tier) => `T${tier} ${fmt(floors[tier]?.p95)}`).join(", ")}. A/A false calls: ${aaFalseCalls.length}${aaFalseCalls.length > 0 ? ` (${aaFalseCalls.map((row) => `${describeRow(row)} ${row.verdict}`).join("; ")})` : ""}. noarity's stage floors: ${noarityStage === undefined ? "-" : TIERS.map((tier) => `T${tier} ${fmt(noarityStage.floors[tier]?.p95)}`).join(", ")}.`,
    "",
  );

  // 1. The target flow vs the branch.
  const flowRows = [];
  for (const [name, entry] of [
    ...SLIMS.map((copy) => [label(copy), judged[copy]]),
    ...(noarity === undefined ? [] : [["noarity (its stage)", noarity]]),
  ]) {
    flowRows.push(
      [`**${name}**`, ...flowCells(entry.flowLine), entry.flowLine.reading],
      ...entry.groups.map(([group, line]) => [
        `  ${group}`,
        ...flowCells(line),
        "",
      ]),
    );
  }
  lines.push(
    "## 1. Target flow vs the branch",
    "",
    `Target flow: \`${JSON.stringify(targetsOf(SLIM1) ?? {})}\` (noarity's). A/A fire rate of the sign test on random flows of ${flowSize} (both directions): ${aaRate === undefined ? "-" : `${(aaRate * 100).toFixed(1)}%`}.`,
    "",
    table(
      [
        "copy / flow",
        "n",
        "copy/branch gm per run",
        "overall",
        "sign count",
        "reading",
      ],
      flowRows,
    ),
    "",
    "Tier-rule losses vs the branch (tier, scenario, median (copy-first / branch-first)):",
    "",
    ...[
      ...SLIMS.map((copy) => [label(copy), judged[copy]]),
      ...(noarity === undefined ? [] : [["noarity (its stage)", noarity]]),
    ].map(
      ([name, entry]) =>
        `- ${name}: ${entry.vsBranch.bars.length === 0 ? "none" : entry.vsBranch.bars.map((row) => describeRow(row)).join("; ")}. Tier geomeans vs branch: ${TIERS.map((tier) => `T${tier} ${tierCell(entry.vsBranch, tier)}`).join("; ")}.`,
    ),
    "",
  );

  // 2. Tier bars vs main.
  const branchVsMain = compare(scenarios, BRANCH, MAIN, floors);
  const clamp = scenarios.find(
    (scenario) =>
      scenario.group === "G7" &&
      scenario.id === "clamp data-last" &&
      scenario.size === "C",
  );
  const clampCell = (copy) => {
    if (clamp === undefined) {
      return "-";
    }
    const evaluated = evaluate(clamp, copy, MAIN, floors);
    const mean = distribution(
      ratiosOf(clamp, copy, MAIN, "mean").map((row) => row.ratio),
    )?.median;
    return `${fmt(evaluated?.median)} p75 / ${fmt(mean)} mean, ${evaluated?.verdict ?? "n/a"}`;
  };
  lines.push(
    "## 2. Tier bars vs main",
    "",
    "Tier 1: regression when the median is beyond 1 + floor in both orders. Tier 2: median >= 1.05, every run > 1.00 and median - 1 beyond the floor. Tier 3: report only, BLOCK when every run is >= 1.25. Bar violations read: tier, scenario, median (copy-first / main-first).",
    "",
    table(
      [
        "copy",
        "T1 vs main",
        "T2 vs main",
        "T3 vs main",
        "bar violations",
        "clamp data-last C vs main",
      ],
      [
        [BRANCH, branchVsMain],
        ...SLIMS.map((copy) => [copy, judged[copy].vsMain]),
      ].map(([copy, summary]) => [
        label(copy),
        ...TIERS.map((tier) => tierCell(summary, tier)),
        summary.bars.length === 0
          ? "none"
          : summary.bars.map((row) => describeRow(row)).join("; "),
        clampCell(copy),
      ]),
    ),
    "",
  );

  // 3. The rows noarity lost on.
  const focusKeys = scenarios
    .filter((scenario) => isFocusRow(scenario))
    .map((scenario) => scenario.key)
    .sort();
  const cell = (entryStage, key, copy, reference) => {
    const scenario = entryStage?.scenarios.find(
      (candidate) => candidate.key === key,
    );
    const evaluated =
      scenario === undefined
        ? undefined
        : evaluate(scenario, copy, reference, entryStage.floors);
    return evaluated === undefined
      ? "-"
      : `${fmt(evaluated.median)} (${fmt(evaluated.candidateFirst)} / ${fmt(evaluated.referenceFirst)}) ${evaluated.verdict}${evaluated.note}`;
  };
  out.focus = focusKeys;
  lines.push(
    "## 3. G3 scalar purry and pipe(x, add(1)) rows (all tier 1)",
    "",
    "Cells: median (copy-first / reference-first) and the tier verdict of copy vs reference. noarity's cells come from its own stage.",
    "",
    table(
      [
        "scenario",
        "slim1/branch",
        "slim01/branch",
        "noarity/branch",
        "slim1/main",
        "slim01/main",
        "noarity/main",
        "branch/main",
      ],
      focusKeys.map((key) => [
        shortKey(key),
        cell(stage, key, SLIM1, BRANCH),
        cell(stage, key, SLIM01, BRANCH),
        cell(noarityStage, key, NOARITY, BRANCH),
        cell(stage, key, SLIM1, MAIN),
        cell(stage, key, SLIM01, MAIN),
        cell(noarityStage, key, NOARITY, MAIN),
        cell(stage, key, BRANCH, MAIN),
      ]),
    ),
    "",
  );
}

// 4. The lower JIT tiers.
lines.push(
  "## 4. Lower JIT tiers (G3, G6, G7 data-last; every scenario tier 3)",
  "",
);
out.lowerTiers = {};
for (const [prefix, title] of [
  ["jitless", "--jitless"],
  ["maxopt1", "--max-opt=1"],
]) {
  const runs = loadRuns(DIR, new RegExp(`^${prefix}-r\\d+\\.json$`, "u"));
  const noarityRuns = loadRuns(
    NOARITY_DIR,
    new RegExp(`^${prefix}-r\\d+\\.json$`, "u"),
  );
  if (runs.length === 0) {
    lines.push(`${title}: no runs (${prefix}-r*.json).`, "");
    continue;
  }
  const scenarios = buildScenarios(runs, SLIMS);
  const floors = floorsOf(scenarios);
  const noarityScenarios =
    noarityRuns.length === 0
      ? undefined
      : buildScenarios(noarityRuns, [NOARITY]);
  const rows = [];
  const summary = {};
  const pairs = [
    [runs, scenarios, floors, SLIM1, BRANCH],
    [runs, scenarios, floors, SLIM01, BRANCH],
    ...(noarityScenarios === undefined
      ? []
      : [
          [
            noarityRuns,
            noarityScenarios,
            floorsOf(noarityScenarios),
            NOARITY,
            BRANCH,
          ],
        ]),
    [runs, scenarios, floors, SLIM1, MAIN],
    [runs, scenarios, floors, SLIM01, MAIN],
    [runs, scenarios, floors, BRANCH, MAIN],
    [runs, scenarios, floors, AA, MAIN],
  ];
  for (const [
    pairRuns,
    pairScenarios,
    pairFloors,
    candidate,
    reference,
  ] of pairs) {
    const list = pairScenarios.filter(
      (scenario) => ratiosOf(scenario, candidate, reference).length > 0,
    );
    const line = flowLine(pairRuns, list, candidate, reference);
    const tierSummary = compare(
      pairScenarios,
      candidate,
      reference,
      pairFloors,
    );
    const name = `${label(candidate)} / ${label(reference)}${candidate === NOARITY ? " (its stage)" : ""}`;
    summary[name] = {
      ...line,
      blocks: tierSummary.bars.map((row) => describeRow(row)),
    };
    rows.push([
      name,
      ...flowCells(line),
      ["G3", "G6", "G7"]
        .map((group) =>
          fmt(
            flowLine(
              pairRuns,
              list.filter((scenario) => scenario.group === group),
              candidate,
              reference,
            ).overall,
          ),
        )
        .join(" / "),
      `${Object.entries(tierSummary.tiers[3].counts)
        .map(([verdict, count]) => `${verdict} ${count}`)
        .join(", ")}; BLOCK: ${
        tierSummary.bars.map((row) => describeRow(row)).join("; ") || "none"
      }`,
    ]);
  }
  out.lowerTiers[prefix] = summary;
  const watched = scenarios.filter(
    (scenario) =>
      (scenario.id === "entries data-last" &&
        ["XS", "S"].includes(scenario.size)) ||
      isFocusRow(scenario),
  );
  const medianCell = (scenario, copy, reference) => {
    const evaluated = evaluate(scenario, copy, reference, floors);
    return evaluated === undefined
      ? "-"
      : `${fmt(evaluated.median)} (${evaluated.rows.map((row) => fmt(row.ratio)).join(", ")})`;
  };
  lines.push(
    `### ${title} (${runs.length} runs: ${runs.map((run) => run.order.map(label).join(",")).join(" / ")}; A/A floor p95 ${fmt(floors[3]?.p95)})`,
    "",
    table(
      [
        "pair",
        "n",
        "gm per run",
        "overall",
        "sign count",
        "overall G3 / G6 / G7",
        "tier 3 verdicts",
      ],
      rows,
    ),
    "",
    table(
      [
        "scenario",
        "slim1/branch (per run)",
        "slim01/branch (per run)",
        "branch/main",
      ],
      watched
        .sort((left, right) => left.key.localeCompare(right.key))
        .map((scenario) => [
          shortKey(scenario.key),
          medianCell(scenario, SLIM1, BRANCH),
          medianCell(scenario, SLIM01, BRANCH),
          fmt(evaluate(scenario, BRANCH, MAIN, floors)?.median),
        ]),
    ),
    "",
  );
}

// 5. The rule, ranked by bytes saved.
const bundle = readJson(path.join(DIR, "bundle.json"));
const savedVsBranch = (copy, entry, bundler) => {
  const row = bundle?.rows.find(
    (candidate) => candidate.entry === entry && candidate.bundler === bundler,
  );
  return row?.[BRANCH] === undefined || row[copy] === undefined
    ? undefined
    : {
        minified: row[BRANCH].minified - row[copy].minified,
        gzip: row[BRANCH].gzip - row[copy].gzip,
        brotli: row[BRANCH].brotli - row[copy].brotli,
      };
};
lines.push(
  "## 5. Rule",
  "",
  `Adoptable = no tier 1 loss vs the branch beyond the floor (tier 1 rule, both orders) and no tier-bar violation vs main. Adoptable variants are ranked by bytes saved vs the branch on \`${RANK_ENTRY}\` (${RANK_BUNDLER}, minified; ties: gzip).`,
  "",
);
if (stage === undefined) {
  lines.push("No confirmation runs: no rule.", "");
} else {
  const rule = [
    ...SLIMS.map((copy) => [label(copy), judged[copy]]),
    ...(noarity === undefined ? [] : [["noarity (its stage)", noarity]]),
  ].map(([name, entry]) => {
    const saved = savedVsBranch(entry.copy, RANK_ENTRY, RANK_BUNDLER);
    const whole = savedVsBranch(entry.copy, "whole library", RANK_BUNDLER);
    return {
      name,
      copy: entry.copy,
      adoptable:
        entry.tier1Losses.length === 0 && entry.vsMain.bars.length === 0,
      tier1Losses: entry.tier1Losses.map((row) => describeRow(row)),
      barsVsMain: entry.vsMain.bars.map((row) => describeRow(row)),
      flowOverall: entry.flowLine.overall,
      saved,
      whole,
    };
  });
  out.rule = rule;
  const ranked = rule
    .filter((entry) => entry.adoptable && entry.saved !== undefined)
    .sort(
      (left, right) =>
        right.saved.minified - left.saved.minified ||
        right.saved.gzip - left.saved.gzip,
    );
  lines.push(
    table(
      [
        "copy",
        "tier 1 losses vs branch",
        "bar violations vs main",
        "flow gm vs branch",
        `saved on ${RANK_ENTRY} (min / gz / br)`,
        "saved on whole library",
        "adoptable",
      ],
      rule.map((entry) => [
        entry.name,
        entry.tier1Losses.join("; ") || "none",
        entry.barsVsMain.join("; ") || "none",
        fmt(entry.flowOverall, 4),
        entry.saved === undefined
          ? "-"
          : `${entry.saved.minified} / ${entry.saved.gzip} / ${entry.saved.brotli}`,
        entry.whole === undefined
          ? "-"
          : `${entry.whole.minified} / ${entry.whole.gzip} / ${entry.whole.brotli}`,
        entry.adoptable ? "**yes**" : "no",
      ]),
    ),
    "",
    `**Rule: ${
      ranked.length === 0
        ? "no variant is adoptable"
        : `adoptable, by bytes saved: ${ranked.map((entry) => `${entry.name} (${entry.saved.minified} B min / ${entry.saved.gzip} B gzip)`).join(" > ")}`
    }; not adoptable: ${
      rule
        .filter((entry) => !entry.adoptable)
        .map((entry) => entry.name)
        .join(", ") || "none"
    }.**`,
    "",
  );
}

// 6. Bundle size.
lines.push("## 6. Bundle size (minified ESM; gzip 9, brotli 11)", "");
if (bundle === undefined) {
  lines.push("bundle.json missing.", "");
} else {
  const triple = (stats) =>
    stats === undefined
      ? "-"
      : `${stats.minified} / ${stats.gzip} / ${stats.brotli}`;
  const delta = (left, right) =>
    left === undefined || right === undefined
      ? "-"
      : ["minified", "gzip", "brotli"]
          .map((metric) => signed(left[metric] - right[metric]))
          .join(" / ");
  const variants = [SLIM1, SLIM01, NOARITY];
  lines.push(
    table(
      [
        "import set",
        "bundler",
        "main min / gz / br",
        "branch",
        ...variants.map((copy) => label(copy)),
        ...variants.map((copy) => `${label(copy)} saved vs branch`),
      ],
      bundle.rows.map((row) => [
        row.entry,
        row.bundler,
        triple(row[MAIN]),
        triple(row[BRANCH]),
        ...variants.map((copy) => triple(row[copy])),
        ...variants.map((copy) => delta(row[BRANCH], row[copy])),
      ]),
    ),
    "",
  );
}

writeFileSync(path.join(DIR, "verdict.md"), `${lines.join("\n")}\n`);
writeFileSync(
  path.join(DIR, "verdict.json"),
  `${JSON.stringify(out, undefined, 2)}\n`,
);
process.stdout.write(
  `${lines.join("\n")}\n\n[slimarity-verdict] written to ${path.join(DIR, "verdict.md")}\n`,
);
