// Verdicts of the pre-publication stage (stages/prepub.steps): the variant
// rule for the two optional changes on top of cand-base, the Vue gate for the
// for...of rework, cand-full vs main in the extra environments, and the final
// composition.
//
//   node scripts/prepub-verdicts.mjs [--dir results/prepub] [--aa-draws 2000]
//
// Inputs (under --dir): conf-r*.json (the confirmation runs), reactive.json,
// vue-shapes.json, traps.json, x-<env>-r*.json; alloc.md and bundle.md are
// linked. Writes <dir>/verdicts.md and <dir>/verdicts.json.
//
// The variant rule, as agreed (a variant is charged with what it causes):
//   - sign test: faster than its reference in every run on its target flow
//     (per-run geomean < 1) with overall geomean <= 0.99;
//   - no loss against its reference under the tier rules (tier 1 regression in
//     both orders beyond the A/A floor, tier 2 regression, tier 3 BLOCK);
//   - the same sign test fires on A/A (main-aa vs main, both directions,
//     random flows of the same size) under 5% of the time.
// Violations against main that the reference doesn't have are listed; they
// are charged only through the second point (a variant/reference loss).
// cand-forof must also bring Vue's tracked dependencies back to main's count
// on the gated shapes.

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
    dir: { type: "string", default: "results/prepub" },
    "aa-draws": { type: "string", default: "2000" },
  },
});
const DIR = path.resolve(PERF_DIR, values.dir);
const DRAWS = Number(values["aa-draws"]);
const TIERS = [1, 2, 3];
const MAIN = "main";
const AA = "main-aa";
const BASE = "branch-v-cand-base";
const MAP = "branch-v-cand-map";
const FOROF = "branch-v-cand-forof";
const FULL = "branch-v-cand-full";
const CANDIDATES = [BASE, MAP, FOROF, FULL];
const label = (copy) => copy.replace("branch-v-", "");
// The shapes whose Vue dependencies must return to main's count.
const VUE_GATE = [
  "pipe(items, filter, map, take(10))",
  "pipe(items, find(id === 20))",
  "pipe(items, take(10))",
];

const fmt = (value, digits = 3) =>
  value === undefined || !Number.isFinite(value) ? "-" : value.toFixed(digits);
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

// --- Loading (as scripts/aggregate.mjs) -------------------------------------------

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

function buildScenarios(runs, fastReference) {
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
      metric:
        Math.min(medianP75(MAIN), medianP75(fastReference)) < 0.001
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
    if (!Number.isFinite(ratio)) {
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

const describeBar = (row) =>
  `T${row.scenario.tier} ${shortKey(row.scenario.key)} ${fmt(row.median)} (${fmt(row.candidateFirst)} / ${fmt(row.referenceFirst)})${row.note}`;
const tierCell = (summary, tier) =>
  summary.tiers[tier].n === 0
    ? "-"
    : `${fmt(summary.tiers[tier].geomean)} (${summary.tiers[tier].n}; ${Object.entries(
        summary.tiers[tier].counts,
      )
        .map(([verdict, count]) => `${verdict} ${count}`)
        .join(", ")})`;

// --- Confirmation -------------------------------------------------------------------

const out = { generatedAt: new Date().toISOString(), dir: values.dir };
const lines = [
  "# Pre-publication verdicts",
  "",
  `Generated by scripts/prepub-verdicts.mjs from ${values.dir}. Ratios are copy/reference (< 1 = faster); gm = popularity-weighted geomean of the per-scenario median ratio (high 4, mid 2, low 1).`,
  "",
];

const confirmation = loadRuns(/^conf-r\d+\.json$/u);
out.confirmationRuns = confirmation.map((run) => ({
  name: run.name,
  order: run.order,
}));
const index = readVariantsIndex();
const variantRule = {};
let composition = "cand-base";
if (confirmation.length === 0) {
  lines.push(
    "No confirmation runs (conf-r*.json): no rule verdicts; composition defaults to cand-base.",
    "",
  );
} else {
  const scenarios = buildScenarios(confirmation, BASE);
  const floors = floorsOf(scenarios);
  out.floors = Object.fromEntries(
    TIERS.map((tier) => [tier, floors[tier]?.p95]),
  );
  const aaSummary = compare(scenarios, AA, MAIN, floors);
  out.aaFalseCalls = Object.fromEntries(
    TIERS.map((tier) => [
      tier,
      aaSummary.evaluated
        .filter(
          (row) => row.scenario.tier === tier && row.verdict !== "neutral",
        )
        .map((row) => `${shortKey(row.scenario.key)} (${row.verdict})`),
    ]),
  );
  lines.push(
    `## Confirmation (${confirmation.length} runs: ${confirmation.map((run) => run.order.map(label).join(",")).join(" / ")})`,
    "",
    `A/A floors (p95 |main-aa/main - 1|): ${TIERS.map((tier) => `T${tier} ${fmt(floors[tier]?.p95)}`).join(", ")}. A/A false calls: ${TIERS.map((tier) => `T${tier} ${out.aaFalseCalls[tier].length}/${aaSummary.tiers[tier].n}`).join(", ")}${TIERS.some((tier) => out.aaFalseCalls[tier].length > 0) ? ` (${TIERS.flatMap((tier) => out.aaFalseCalls[tier]).join("; ")})` : ""}.`,
    "",
  );

  // Every candidate against main and against cand-base.
  const summaries = {};
  const rows = [];
  for (const copy of CANDIDATES) {
    const vsMain = compare(scenarios, copy, MAIN, floors);
    const vsBase =
      copy === BASE ? undefined : compare(scenarios, copy, BASE, floors);
    summaries[copy] = { vsMain, vsBase };
    rows.push([
      label(copy),
      ...TIERS.map((tier) => tierCell(vsMain, tier)),
      vsMain.bars.length === 0
        ? "none"
        : vsMain.bars.map((row) => describeBar(row)).join("; "),
      vsBase === undefined
        ? "-"
        : TIERS.map(
            (tier) => `T${tier} ${fmt(vsBase.tiers[tier].geomean)}`,
          ).join(", "),
    ]);
  }
  lines.push(
    table(
      [
        "copy",
        "T1 vs main",
        "T2 vs main",
        "T3 vs main",
        "bar violations vs main",
        "gm vs cand-base",
      ],
      rows,
    ),
    "",
  );

  // The variant rule for the two optional changes.
  const reference = BASE;
  const perRunRatios = (candidate, ref, list, invert = false) =>
    confirmation.map((run) =>
      list
        .map((scenario) => {
          const row = ratiosOf(scenario, candidate, ref).find(
            (candidateRow) => candidateRow.run === run.name,
          );
          if (row === undefined) {
            return undefined;
          }
          return invert ? 1 / row.ratio : row.ratio;
        })
        .filter((value) => value !== undefined),
    );
  const aaPool = scenarios.filter(
    (scenario) => ratiosOf(scenario, AA, MAIN).length > 0,
  );
  const vueShapes = readJson(path.join(DIR, "vue-shapes.json"));
  const reactive = readJson(path.join(DIR, "reactive.json"));
  for (const [name, copy] of [
    ["cand-map", MAP],
    ["cand-forof", FOROF],
  ]) {
    const variant = index.find((candidate) => candidate.name === name);
    const flow = scenarios.filter(
      (scenario) =>
        variant !== undefined &&
        targetMatches(variant.targets, scenario) &&
        ratiosOf(scenario, copy, reference).length > 0,
    );
    const sign = signConsistent(perRunRatios(copy, reference, flow));
    const losses = summaries[copy].vsBase.bars;
    const baseBars = new Set(
      summaries[BASE].vsMain.bars.map((row) => row.scenario.key),
    );
    const newVsMain = summaries[copy].vsMain.bars.filter(
      (row) => !baseBars.has(row.scenario.key),
    );
    let fired = 0;
    let tried = 0;
    if (flow.length > 0 && aaPool.length >= flow.length) {
      const random = seededRandom(0x5e_ed + flow.length);
      for (let draw = 0; draw < DRAWS; draw++) {
        const pool = [...aaPool];
        const picked = [];
        for (let pick = 0; pick < flow.length; pick++) {
          picked.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
        }
        for (const invert of [false, true]) {
          tried += 1;
          if (signConsistent(perRunRatios(AA, MAIN, picked, invert)).fires) {
            fired += 1;
          }
        }
      }
    }
    const aaRate = tried === 0 ? undefined : fired / tried;
    let vue;
    if (copy === FOROF) {
      const mainRow = vueShapes?.rows.find((row) => row.copy === MAIN);
      const copyRow = vueShapes?.rows.find((row) => row.copy === copy);
      const probeDeps = (id) =>
        reactive?.rows.find((row) => row.framework === "vue" && row.copy === id)
          ?.dependencies;
      vue =
        mainRow === undefined || copyRow === undefined
          ? { ok: false, detail: "vue-shapes.json missing" }
          : {
              ok:
                VUE_GATE.every(
                  (shape) =>
                    copyRow.dependencies[shape] === mainRow.dependencies[shape],
                ) &&
                (probeDeps(copy) === undefined ||
                  probeDeps(copy) === probeDeps(MAIN)),
              detail: `${VUE_GATE.map((shape) => `${shape}: ${copyRow.dependencies[shape]} (main ${mainRow.dependencies[shape]})`).join("; ")}; reactive probe: ${probeDeps(copy) ?? "-"} (main ${probeDeps(MAIN) ?? "-"})`,
            };
    }
    const reasons = [
      flow.length === 0 ? "no target scenario measured" : undefined,
      sign.fires
        ? undefined
        : `sign test: faster in ${sign.fasterRuns}/${sign.runs} runs, geomean ${fmt(sign.overall, 4)}`,
      losses.length > 0
        ? `losses vs cand-base: ${losses.map((row) => describeBar(row)).join("; ")}`
        : undefined,
      aaRate !== undefined && aaRate >= 0.05
        ? `A/A fires ${(aaRate * 100).toFixed(1)}%`
        : undefined,
      aaRate === undefined && flow.length > 0 ? "no A/A pool" : undefined,
      vue !== undefined && !vue.ok ? `Vue gate: ${vue.detail}` : undefined,
    ].filter((reason) => reason !== undefined);
    variantRule[name] = {
      flowSize: flow.length,
      sign,
      losses: losses.map((row) => describeBar(row)),
      newVsMain: newVsMain.map((row) => describeBar(row)),
      aaRate,
      vue,
      passes: reasons.length === 0,
      reasons,
    };
  }
  out.variantRule = variantRule;
  lines.push(
    "## Variant rule (reference: cand-base)",
    "",
    table(
      [
        "change",
        "flow n",
        "flow gm per run",
        "overall",
        "faster runs",
        "losses vs cand-base",
        "new vs main (charged only through a loss)",
        "A/A fire",
        "Vue gate",
        "result",
      ],
      Object.entries(variantRule).map(([name, rule]) => [
        name,
        String(rule.flowSize),
        rule.sign.perRun.map((value) => fmt(value)).join(", "),
        fmt(rule.sign.overall, 4),
        `${rule.sign.fasterRuns}/${rule.sign.runs}`,
        rule.losses.join("; ") || "none",
        rule.newVsMain.join("; ") || "none",
        rule.aaRate === undefined ? "-" : `${(rule.aaRate * 100).toFixed(1)}%`,
        rule.vue === undefined
          ? "-"
          : `${rule.vue.ok ? "ok" : "FAILS"}: ${rule.vue.detail}`,
        rule.passes ? "**PASS**" : `fails: ${rule.reasons.join("; ")}`,
      ]),
    ),
    "",
  );
  const mapPasses = variantRule["cand-map"].passes;
  const forofPasses = variantRule["cand-forof"].passes;
  composition =
    mapPasses && forofPasses
      ? "cand-full"
      : mapPasses
        ? "cand-map"
        : forofPasses
          ? "cand-forof"
          : "cand-base";
}
out.composition = composition;
lines.splice(
  4,
  0,
  `**Final composition: ${composition}** (cand-full when both the map shortcut and the for...of rework pass, cand-map or cand-forof when one does, cand-base when neither).`,
  "",
);

// --- Reactive probes, Vue shapes, traps ---------------------------------------------

const reactive = readJson(path.join(DIR, "reactive.json"));
const vueShapes = readJson(path.join(DIR, "vue-shapes.json"));
const traps = readJson(path.join(DIR, "traps.json"));
lines.push("## Reactive stores and Proxy items", "");
if (reactive !== undefined) {
  lines.push(
    table(
      [
        "framework",
        "copy",
        "dependencies",
        "on $$remedaLazyRef",
        "re-eval median us",
        "growth KiB",
      ],
      reactive.rows.map((row) => [
        row.framework,
        label(row.copy),
        String(row.dependencies),
        String(row.dependenciesOnControlKey),
        fmt(row.medianUs, 2),
        fmt(row.heapGrowthKiB, 1),
      ]),
    ),
    "",
  );
} else {
  lines.push("reactive.json missing.", "");
}
if (vueShapes !== undefined) {
  lines.push(
    table(
      ["copy", ...vueShapes.shapes],
      vueShapes.rows.map((row) => [
        label(row.copy),
        ...vueShapes.shapes.map(
          (shape) =>
            `${row.dependencies[shape]}${row.matchesMain[shape] ? "" : " (differs from main)"}`,
        ),
      ]),
    ),
    "",
  );
}
if (traps !== undefined) {
  lines.push(
    table(
      ["scenario", ...Object.keys(traps.traps[0]?.counts ?? {}).map(label)],
      traps.traps.map((row) => [
        shortKey(row.key),
        ...Object.values(row.counts).map(
          (count) => `${count.has} has / ${count.get} get`,
        ),
      ]),
    ),
    "",
    `Validation of the trap run: ${traps.outputMismatches.length} output and ${traps.traceMismatches.length} trace mismatches.`,
    "",
  );
}
out.reactive = reactive?.rows;
out.vueShapes = vueShapes?.rows;
out.traps = traps?.traps;

// --- cand-full vs main in the environments where the branch broke a tier bar ---------

lines.push(
  "## cand-full vs main where the branch broke a tier bar (2 runs each)",
  "",
);
const environments = [
  ["x-p0", "pollution P0 (G2, G10 at C/M)"],
  ["x-p1", "pollution P1 (G2, G10 at C/M)"],
  ["x-node24", "Node 24 (HD)"],
  ["x-bun", "Bun, portable runner (HD)"],
  ["x-isolated", "one copy per process (H)"],
];
const extraRows = [];
out.extras = {};
for (const [prefix, title] of environments) {
  const runs = loadRuns(new RegExp(`^${prefix}-r\\d+\\.json$`, "u"));
  if (runs.length === 0) {
    extraRows.push([title, "-", "-", "-", "-", "missing"]);
    continue;
  }
  const scenarios = buildScenarios(runs, FULL);
  const floors = floorsOf(scenarios);
  const summary = compare(scenarios, FULL, MAIN, floors);
  out.extras[prefix] = {
    floors: Object.fromEntries(TIERS.map((tier) => [tier, floors[tier]?.p95])),
    tiers: summary.tiers,
    bars: summary.bars.map((row) => describeBar(row)),
  };
  extraRows.push([
    title,
    ...TIERS.map((tier) => tierCell(summary, tier)),
    TIERS.map((tier) => fmt(floors[tier]?.p95)).join("/"),
    summary.bars.length === 0
      ? "none"
      : summary.bars.map((row) => describeBar(row)).join("; "),
  ]);
}
lines.push(
  table(
    [
      "environment",
      "T1 gm",
      "T2 gm",
      "T3 gm",
      "floors",
      "bar violations (median; cand-full first / main first)",
    ],
    extraRows,
  ),
  "",
  `Allocations: ${existsSync(path.join(DIR, "alloc.md")) ? `${values.dir}/alloc.md` : "missing"}. Bundle size: ${existsSync(path.join(DIR, "bundle.md")) ? `${values.dir}/bundle.md` : "missing"}.`,
  "",
);

writeFileSync(path.join(DIR, "verdicts.md"), `${lines.join("\n")}\n`);
writeFileSync(
  path.join(DIR, "verdicts.json"),
  `${JSON.stringify(out, undefined, 2)}\n`,
);
process.stdout.write(
  `${lines.join("\n")}\n\n[prepub-verdicts] composition: ${composition}; written to ${path.join(DIR, "verdicts.md")}\n`,
);
