// The PR summary's area table for one run set: scenarios grouped by shape and
// size (the areas defined in summary-data.md, section 2), whatever tier their
// popularity moved them to; popularity only weights them. Per area: the
// popularity-weighted geomean of the per-scenario median branch/main ratios,
// the range of those medians, the verdict counts (each scenario judged at its
// own tier with the run set's A/A floors; "slower" counts slower, regression
// and BLOCK) and how many scenarios each judged tier holds. Then the same
// numbers per judged tier ("all tier N scenarios, as judged").
//
//   node scripts/areas.mjs --dir results/final [--prefix full-r] [--out <file>]
//
// --prefix picks the run files (`full-r` for the full matrix, `x-node22-r`
// for an extra). Loading, metric choice, floors and verdicts come from
// a8/lib.mjs, which mirrors scripts/aggregate.mjs. On results/publication this
// reproduces summary-data.md's headline rows (checked 2026-10-14).

import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  buildScenarios,
  evaluate,
  floorsOf,
  fmt,
  geomean,
  loadRuns,
  PERF,
} from "../a8/lib.mjs";

const { values } = parseArgs({
  options: {
    dir: { type: "string" },
    prefix: { type: "string", default: "full-r" },
    out: { type: "string", default: "" },
  },
});
if (values.dir === undefined) {
  throw new Error("usage: node scripts/areas.mjs --dir results/<stage>");
}

const dir = path.resolve(PERF, values.dir);
const files = readdirSync(dir)
  .filter(
    (file) =>
      file.startsWith(values.prefix) &&
      file.endsWith(".json") &&
      !file.endsWith(".meta.json"),
  )
  .map((file) => path.join(dir, file));
if (files.length === 0) {
  throw new Error(`no ${values.prefix}*.json runs in ${dir}`);
}

const runs = loadRuns(files);
const scenarios = buildScenarios(runs);
const floors = floorsOf(scenarios);
const evaluated = scenarios
  .map((scenario) => ({
    scenario,
    result: evaluate(scenario, "branch", "main", floors),
  }))
  .filter(({ result }) => result !== undefined);

const isDataFirstShape = ({ group, kind }) =>
  group === "G5" || group === "G7" || (group === "G6" && kind === "data-last");
const isMixedDeepPipe = ({ group, id }) =>
  group === "G2" && id.endsWith(" mixed");
const UP_TO_C = ["XS", "S", "C"];

const AREAS = [
  {
    tier: 1,
    name: "Data-first calls, 16-100 items",
    matches: (s) => isDataFirstShape(s) && ["S", "C"].includes(s.size),
  },
  {
    tier: 1,
    name: "Data-first in hot loops, 0-3 items",
    matches: (s) => isDataFirstShape(s) && s.size === "XS",
  },
  { tier: 1, name: "Non-lazy pipes", matches: (s) => s.group === "G3" },
  {
    tier: 1,
    name: "Short lazy pipes, 0-100 items",
    matches: (s) => ["G1", "G1b"].includes(s.group) && UP_TO_C.includes(s.size),
  },
  {
    tier: 1,
    name: "Interleaved pipes, 0-100 items",
    matches: (s) =>
      (s.group === "G10" || isMixedDeepPipe(s)) && UP_TO_C.includes(s.size),
  },
  {
    tier: 2,
    name: "Lazy and interleaved pipes, 1,000 items",
    matches: (s) =>
      (["G1", "G1b", "G10"].includes(s.group) || isMixedDeepPipe(s)) &&
      s.size === "M",
  },
  {
    tier: 2,
    name: "Other iterables (Set, string, generator)",
    matches: (s) => s.group === "G4",
  },
  {
    tier: 2,
    name: "Reused steps and `piped`",
    matches: (s) => s.group === "G6" && s.kind === "reuse",
  },
  {
    tier: 2,
    name: "Data-first calls, 1,000 items",
    matches: (s) => isDataFirstShape(s) && ["M", "Mx64"].includes(s.size),
  },
  {
    tier: 2,
    name: "Callbacks that declare no parameters",
    matches: (s) => s.group === "G9",
  },
  {
    tier: 3,
    name: "Long consecutive lazy runs (8-15 steps)",
    matches: (s) => s.group === "G2" && !isMixedDeepPipe(s) && s.size !== "L",
  },
  { tier: 3, name: "100,000 items", matches: (s) => s.size === "L" },
  { tier: 3, name: "Exotic item kinds", matches: (s) => s.group === "G8" },
];

function rowFor(label, rows) {
  const medians = rows.map(({ result }) => result.median);
  const counts = { faster: 0, neutral: 0, slower: 0 };
  const judgedTiers = { 1: 0, 2: 0, 3: 0 };
  for (const { result } of rows) {
    const verdict = result.verdict;
    if (verdict === "faster" || verdict === "neutral") {
      counts[verdict] += 1;
    } else {
      counts.slower += 1;
    }
    judgedTiers[result.tier] += 1;
  }
  return {
    label,
    n: rows.length,
    geomean: geomean(
      medians,
      rows.map(({ result }) => result.weight),
    ),
    min: Math.min(...medians),
    max: Math.max(...medians),
    counts,
    judgedTiers,
    bar: rows
      .filter(({ result }) => result.bar)
      .map(({ result }) => result.key),
  };
}

const lines = [
  `# Areas: ${path.relative(PERF, dir)}/${values.prefix}*`,
  "",
  `${runs.length} runs (${runs.map((run) => run.name).join(", ")}); ${evaluated.length} scenarios. A/A floors (p95 of |main-aa/main - 1|): ${[1, 2, 3].map((tier) => `T${tier} ${fmt(floors[tier]?.p95)}`).join(", ")}.`,
  "",
  "| tier | area | scenarios | gm branch/main | range of scenario medians | faster / neutral / slower | scenarios per judged tier | bar violations |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
];
const assigned = new Map();
// The environment rows of the summary quote one geomean over every scenario
// of the run set, whatever its tier.
const overall = rowFor("**all scenarios**", evaluated);
lines.push(
  `| all | ${overall.label} | ${overall.n} | ${fmt(overall.geomean)} | ${fmt(overall.min)}-${fmt(overall.max)} | ${overall.counts.faster} / ${overall.counts.neutral} / ${overall.counts.slower} | - | ${overall.bar.length} |`,
);
for (const tier of [1, 2, 3]) {
  const judged = evaluated.filter(({ result }) => result.tier === tier);
  const rows = [
    rowFor(`**all tier ${tier} scenarios, as judged**`, judged),
    ...AREAS.filter((area) => area.tier === tier).map((area) => {
      const members = evaluated.filter(({ scenario }) =>
        area.matches(scenario),
      );
      for (const { scenario } of members) {
        assigned.set(scenario.key, [
          ...(assigned.get(scenario.key) ?? []),
          area.name,
        ]);
      }
      return rowFor(area.name, members);
    }),
  ];
  for (const row of rows) {
    if (row.n === 0) {
      continue;
    }
    const judgedTiers = Object.entries(row.judgedTiers)
      .filter(([, count]) => count > 0)
      .map(([judgedTier, count]) => `T${judgedTier} ${count}`)
      .join(", ");
    lines.push(
      `| ${tier} | ${row.label} | ${row.n} | ${fmt(row.geomean)} | ${fmt(row.min)}-${fmt(row.max)} | ${row.counts.faster} / ${row.counts.neutral} / ${row.counts.slower} | ${row.label.startsWith("**") ? "-" : judgedTiers} | ${row.bar.length === 0 ? 0 : row.bar.join("; ")} |`,
    );
  }
}

// Every scenario of the full matrix belongs to exactly one area; extras
// (subsets, lower JIT tiers) only use the as-judged rows.
const unassigned = evaluated.filter(
  ({ scenario }) => !assigned.has(scenario.key),
);
const doubled = [...assigned].filter(([, names]) => names.length > 1);
lines.push(
  "",
  `Area coverage: ${assigned.size} of ${evaluated.length} scenarios in an area` +
    (unassigned.length > 0
      ? `; outside every area: ${unassigned.map(({ scenario }) => scenario.key).join("; ")}`
      : "") +
    (doubled.length > 0
      ? `; in more than one: ${doubled.map(([key, names]) => `${key} (${names.join(", ")})`).join("; ")}`
      : "") +
    ".",
);

const text = `${lines.join("\n")}\n`;
if (values.out !== "") {
  writeFileSync(path.resolve(PERF, values.out), text);
}
process.stdout.write(text);
