// Verdict of stage noarity (stages/noarity.steps): the branch at 2fab5832
// with lazyDataLastImpl's per-arity data-last closures reverted to main's
// single spread closure (variant `noarity`, copy branch-v-noarity).
//
//   node scripts/noarity-verdict.mjs [--dir results/noarity] [--aa-draws 2000]
//
// Inputs (under --dir): conf-r*.json (the confirmation runs), jitless-r*.json
// and maxopt1-r*.json (the lower JIT tiers), bundle.json. Writes
// <dir>/verdict.md and <dir>/verdict.json. Sections:
//   1. noarity vs branch on the variant's target flow: geomean per run and
//      overall, sign count, the sign test in both directions and its A/A fire
//      rate; the same per target group and on the flow datalast-arity-closures
//      was measured on;
//   2. noarity (and branch) vs main under the tier bars, with the clamp
//      data-last C line called out;
//   3. the lower JIT tiers: noarity vs branch and vs main;
//   4. bundle bytes per import set (main, branch, noarity; saved vs branch).
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
    dir: { type: "string", default: "results/noarity" },
    "aa-draws": { type: "string", default: "2000" },
  },
});
const DIR = path.resolve(PERF_DIR, values.dir);
const DRAWS = Number(values["aa-draws"]);
const TIERS = [1, 2, 3];
const MAIN = "main";
const AA = "main-aa";
const BRANCH = "branch";
const NOARITY = "branch-v-noarity";
const VARIANT = "noarity";
const ORIGINAL = "datalast-arity-closures";
const label = (copy) =>
  copy === NOARITY ? "noarity" : copy.replace("branch-v-", "");

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

function loadRuns(pattern) {
  if (!existsSync(DIR)) {
    return [];
  }
  return readdirSync(DIR)
    .filter((file) => pattern.test(file))
    .sort()
    .map((file) => {
      const full = path.join(DIR, file);
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

function buildScenarios(runs) {
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
        Math.min(medianP75(MAIN), medianP75(BRANCH), medianP75(NOARITY)) < 0.001
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
    fasterFires: sign.fires,
    slowerFires: inverse.fires,
  };
}

const flowCells = (line) => [
  String(line.n),
  line.perRun.map((value) => fmt(value)).join(", ") || "-",
  fmt(line.overall, 4),
  `${line.fasterRuns} faster / ${line.slowerRuns} slower of ${line.runs}`,
];

// --- Report ---------------------------------------------------------------------

const out = { generatedAt: new Date().toISOString(), dir: values.dir };
const lines = [
  "# Stage noarity: verdict",
  "",
  `Generated by scripts/noarity-verdict.mjs from ${values.dir}. noarity = the branch (2fab5832) with lazyDataLastImpl's per-arity data-last closures reverted to one \`(data) => fn(data, ...args)\` closure (direct lazy/lazyArgs writes kept). Ratios are copy/reference (< 1 = faster); per-scenario ratios use p75 (mean below 1 us); gm = geomean (tier geomeans are popularity-weighted: high 4, mid 2, low 1).`,
  "",
];

const index = readVariantsIndex();
const variant = index.find((candidate) => candidate.name === VARIANT);
const original = index.find((candidate) => candidate.name === ORIGINAL);
const confirmation = loadRuns(/^conf-r\d+\.json$/u);
out.confirmationRuns = confirmation.map((run) => ({
  name: run.name,
  order: run.order,
}));

if (confirmation.length === 0) {
  lines.push(
    "No confirmation runs (conf-r*.json): sections 1 and 2 skipped.",
    "",
  );
} else {
  const scenarios = buildScenarios(confirmation);
  const floors = floorsOf(scenarios);
  const aaSummary = compare(scenarios, AA, MAIN, floors);
  const aaFalseCalls = aaSummary.evaluated.filter(
    (row) => row.verdict !== "neutral",
  );
  out.floors = Object.fromEntries(
    TIERS.map((tier) => [tier, floors[tier]?.p95]),
  );
  lines.push(
    `Confirmation: ${confirmation.length} runs (${confirmation.map((run) => run.order.map(label).join(",")).join(" / ")}), ${scenarios.length} scenarios. A/A floors (p95 |main-aa/main - 1|): ${TIERS.map((tier) => `T${tier} ${fmt(floors[tier]?.p95)}`).join(", ")}. A/A false calls: ${aaFalseCalls.length}${aaFalseCalls.length > 0 ? ` (${aaFalseCalls.map((row) => `${describeRow(row)} ${row.verdict}`).join("; ")})` : ""}.`,
    "",
  );

  // 1. noarity vs branch on the target flow.
  const measured = (scenario) => ratiosOf(scenario, NOARITY, BRANCH).length > 0;
  const flow = scenarios.filter(
    (scenario) =>
      variant !== undefined &&
      targetMatches(variant.targets, scenario) &&
      measured(scenario),
  );
  const target = flowLine(confirmation, flow, NOARITY, BRANCH);
  const aaPool = scenarios.filter(
    (scenario) => ratiosOf(scenario, AA, MAIN).length > 0,
  );
  const aaRate = aaFireRate(confirmation, aaPool, flow.length);
  const groupLines = ["G3", "G6", "G7", "G10"].map((group) => [
    group === "G7" ? "G7 data-last" : group,
    flowLine(
      confirmation,
      flow.filter((scenario) => scenario.group === group),
      NOARITY,
      BRANCH,
    ),
  ]);
  const xsSC = flow.filter((scenario) =>
    ["XS", "S", "C"].includes(scenario.size),
  );
  const originalFlow = scenarios.filter(
    (scenario) =>
      original !== undefined &&
      targetMatches(original.targets, scenario) &&
      measured(scenario),
  );
  const vsBranch = compare(scenarios, NOARITY, BRANCH, floors);
  out.target = { ...target, aaRate };
  out.lossesVsBranch = vsBranch.bars.map((row) => describeRow(row));
  const reading = target.fasterFires
    ? "noarity is consistently FASTER than the branch on the flow (sign test fires)"
    : target.slowerFires
      ? "noarity is consistently SLOWER than the branch on the flow (the mirrored sign test fires: slower in every run, overall >= 1.0101)"
      : "no consistent difference: neither the sign test nor its mirror fires";
  lines.push(
    "## 1. noarity vs branch on the target flow",
    "",
    `Target flow: \`${JSON.stringify(variant?.targets ?? {})}\` (G3 incl. its x64/x1 scalar purry pipes; G6, G7 data-last and G10 at XS/S/C). **${reading}.** A/A fire rate of the sign test on random flows of ${flow.length} (both directions): ${aaRate === undefined ? "-" : `${(aaRate * 100).toFixed(1)}%`}.`,
    "",
    table(
      ["flow", "n", "noarity/branch gm per run", "overall", "sign count"],
      [
        ["target flow", ...flowCells(target)],
        ...groupLines.map(([name, line]) => [`  ${name}`, ...flowCells(line)]),
        [
          "  XS/S/C only",
          ...flowCells(flowLine(confirmation, xsSC, NOARITY, BRANCH)),
        ],
        [
          `${ORIGINAL}'s flow as measured here (G3/G6/G7 both styles/G10 at XS/S; it read 0.991 there at 144fdc8b, so a pure revert expects about 1.009)`,
          ...flowCells(flowLine(confirmation, originalFlow, NOARITY, BRANCH)),
        ],
      ],
    ),
    "",
    `Tier-rule losses of noarity vs branch (all ${vsBranch.evaluated.length} measured scenarios; tier, scenario, median (noarity-first / branch-first)): ${vsBranch.bars.length === 0 ? "none" : vsBranch.bars.map((row) => describeRow(row)).join("; ")}. Tier geomeans noarity/branch: ${TIERS.map((tier) => `T${tier} ${tierCell(vsBranch, tier)}`).join("; ")}.`,
    "",
  );

  // 2. noarity vs main under the tier bars.
  const summaries = Object.fromEntries(
    [BRANCH, NOARITY].map((copy) => [
      copy,
      compare(scenarios, copy, MAIN, floors),
    ]),
  );
  const branchBars = new Set(
    summaries[BRANCH].bars.map((row) => row.scenario.key),
  );
  const noarityBars = new Set(
    summaries[NOARITY].bars.map((row) => row.scenario.key),
  );
  out.barsVsMain = Object.fromEntries(
    [BRANCH, NOARITY].map((copy) => [
      label(copy),
      summaries[copy].bars.map((row) => describeRow(row)),
    ]),
  );
  lines.push(
    "## 2. noarity vs main under the tier bars",
    "",
    "Tier 1: regression when the median is beyond 1 + floor in both orders (copy-first and main-first runs, each on its own median). Tier 2: median >= 1.05, every run > 1.00 and median - 1 beyond the floor. Tier 3: report only, BLOCK when every run is >= 1.25. Bar violations read: tier, scenario, median (copy-first / main-first).",
    "",
    table(
      ["copy", "T1 vs main", "T2 vs main", "T3 vs main", "bar violations"],
      [BRANCH, NOARITY].map((copy) => [
        label(copy),
        ...TIERS.map((tier) => tierCell(summaries[copy], tier)),
        summaries[copy].bars.length === 0
          ? "none"
          : summaries[copy].bars.map((row) => describeRow(row)).join("; "),
      ]),
    ),
    "",
    `New for noarity (not violated by the branch): ${
      summaries[NOARITY].bars
        .filter((row) => !branchBars.has(row.scenario.key))
        .map((row) => describeRow(row))
        .join("; ") || "none"
    }. Fixed by noarity (violated by the branch only): ${
      summaries[BRANCH].bars
        .filter((row) => !noarityBars.has(row.scenario.key))
        .map((row) => describeRow(row))
        .join("; ") || "none"
    }.`,
    "",
  );

  // The clamp data-last C entry that read 1.051 vs main before the per-arity
  // closures (a timer-tick artifact by its means).
  const clamp = scenarios.find(
    (scenario) =>
      scenario.group === "G7" &&
      scenario.id === "clamp data-last" &&
      scenario.size === "C",
  );
  if (clamp === undefined) {
    lines.push("**clamp data-last C: not measured.**", "");
  } else {
    const clampRows = [NOARITY, BRANCH, AA].map((copy) => {
      const evaluated = evaluate(clamp, copy, MAIN, floors);
      const p75 = ratiosOf(clamp, copy, MAIN, "p75");
      const mean = ratiosOf(clamp, copy, MAIN, "mean");
      const marked = (rows) =>
        rows
          .map((row) => `${fmt(row.ratio)}${row.candidateFirst ? "c" : "m"}`)
          .join(", ");
      return [
        label(copy),
        marked(p75),
        fmt(distribution(p75.map((row) => row.ratio))?.median),
        marked(mean),
        fmt(distribution(mean.map((row) => row.ratio))?.median),
        `${evaluated?.verdict ?? "n/a"}${evaluated?.note ?? ""}`,
      ];
    });
    out.clamp = clampRows;
    lines.push(
      `**clamp data-last C** (tier ${clamp.tier}, floor ${fmt(floors[clamp.tier]?.p95)}, verdict metric ${clamp.metric}; \`c\` = the copy ran before main, \`m\` = main first):`,
      "",
      table(
        [
          "copy / main",
          "p75 ratio per run",
          "p75 median",
          "mean ratio per run",
          "mean median",
          "tier verdict",
        ],
        clampRows,
      ),
      "",
    );
  }
}

// 3. The lower JIT tiers.
lines.push(
  "## 3. Lower JIT tiers (G3, G6, G7 data-last; every scenario tier 3)",
  "",
);
out.lowerTiers = {};
for (const [prefix, title] of [
  ["jitless", "--jitless"],
  ["maxopt1", "--max-opt=1"],
]) {
  const runs = loadRuns(new RegExp(`^${prefix}-r\\d+\\.json$`, "u"));
  if (runs.length === 0) {
    lines.push(`${title}: no runs (${prefix}-r*.json).`, "");
    continue;
  }
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const pairs = [
    [NOARITY, BRANCH],
    [NOARITY, MAIN],
    [BRANCH, MAIN],
    [AA, MAIN],
  ];
  const rows = [];
  const summary = {};
  for (const [candidate, reference] of pairs) {
    const list = scenarios.filter(
      (scenario) => ratiosOf(scenario, candidate, reference).length > 0,
    );
    const line = flowLine(runs, list, candidate, reference);
    const tierSummary = compare(scenarios, candidate, reference, floors);
    const byGroup = ["G3", "G6", "G7"].map((group) =>
      fmt(
        flowLine(
          runs,
          list.filter((scenario) => scenario.group === group),
          candidate,
          reference,
        ).overall,
      ),
    );
    summary[`${label(candidate)}/${label(reference)}`] = {
      ...line,
      blocks: tierSummary.bars.map((row) => describeRow(row)),
    };
    rows.push([
      `${label(candidate)} / ${label(reference)}`,
      ...flowCells(line),
      byGroup.join(" / "),
      `${Object.entries(tierSummary.tiers[3].counts)
        .map(([verdict, count]) => `${verdict} ${count}`)
        .join(", ")}; BLOCK: ${
        tierSummary.bars.map((row) => describeRow(row)).join("; ") || "none"
      }`,
    ]);
  }
  out.lowerTiers[prefix] = summary;
  const detail = scenarios
    .filter((scenario) => ratiosOf(scenario, NOARITY, BRANCH).length > 0)
    .map((scenario) => ({
      scenario,
      vsBranch: evaluate(scenario, NOARITY, BRANCH, floors),
      vsMain: evaluate(scenario, NOARITY, MAIN, floors),
      branchVsMain: evaluate(scenario, BRANCH, MAIN, floors),
    }));
  const watched = detail.filter(
    ({ scenario }) =>
      scenario.id === "entries data-last" &&
      ["XS", "S"].includes(scenario.size),
  );
  const extremes = [...detail]
    .sort(
      (left, right) =>
        Math.abs(Math.log(right.vsBranch.median)) -
        Math.abs(Math.log(left.vsBranch.median)),
    )
    .slice(0, 8);
  const detailRow = ({ scenario, vsBranch, vsMain, branchVsMain }) => [
    shortKey(scenario.key),
    `${fmt(vsBranch.median)} (${vsBranch.rows.map((row) => fmt(row.ratio)).join(", ")})`,
    `${fmt(vsMain?.median)} (${vsMain?.rows.map((row) => fmt(row.ratio)).join(", ") ?? "-"})`,
    fmt(branchVsMain?.median),
  ];
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
        "noarity/branch median (per run)",
        "noarity/main median (per run)",
        "branch/main median",
      ],
      [
        ...watched.map((row) => detailRow(row)),
        ["**largest noarity/branch differences**", "", "", ""],
        ...extremes.map((row) => detailRow(row)),
      ],
    ),
    "",
  );
}

// 4. Bundle size.
const bundle = readJson(path.join(DIR, "bundle.json"));
lines.push("## 4. Bundle size (minified ESM; gzip 9, brotli 11)", "");
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
  out.bundle = bundle.rows.map((row) => ({
    entry: row.entry,
    bundler: row.bundler,
    savedVsBranch: Object.fromEntries(
      ["minified", "gzip", "brotli"].map((metric) => [
        metric,
        row[BRANCH] === undefined || row[NOARITY] === undefined
          ? undefined
          : row[BRANCH][metric] - row[NOARITY][metric],
      ]),
    ),
  }));
  lines.push(
    table(
      [
        "import set",
        "bundler",
        "main min / gz / br",
        "branch",
        "noarity",
        "saved by noarity vs branch",
        "noarity vs main",
      ],
      bundle.rows.map((row) => [
        row.entry,
        row.bundler,
        triple(row[MAIN]),
        triple(row[BRANCH]),
        triple(row[NOARITY]),
        delta(row[BRANCH], row[NOARITY]),
        delta(row[NOARITY], row[MAIN]),
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
  `${lines.join("\n")}\n\n[noarity-verdict] written to ${path.join(DIR, "verdict.md")}\n`,
);
