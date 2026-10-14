// Markdown tables for analysis-main.md Part 1, from a8/part1.json, a8/part1b.json,
// a8/g3-modes.json and results/main/bundle.json.
//   node a8/tables.mjs > a8/part1-tables.md
import { readFileSync } from "node:fs";
import path from "node:path";
import { PERF, GROUPS } from "./lib.mjs";

const p = JSON.parse(readFileSync(path.join(PERF, "a8/part1.json"), "utf8"));
const pb = JSON.parse(readFileSync(path.join(PERF, "a8/part1b.json"), "utf8"));
const modes = JSON.parse(
  readFileSync(path.join(PERF, "a8/g3-modes.json"), "utf8"),
);
const bundle = JSON.parse(
  readFileSync(path.join(PERF, "results/main/bundle.json"), "utf8"),
);
const f = (v, d = 3) =>
  v === undefined || v === null || !Number.isFinite(v)
    ? "-"
    : Number(v).toFixed(d);
const pct = (v) => (v === undefined ? "-" : `${(v * 100).toFixed(1)}%`);
// "G3 | scalar arrows depth-3 | x64 | headline" -> "G3 scalar arrows depth-3 x64"
// (no `|` inside table cells).
const short = (key) =>
  key
    .replace(/ \| (headline|data-first-guard|traps)(,[\w-]+)*$/u, "")
    .replaceAll(" | ", " ");
const G3C =
  /^G3 \| (scalar (arrows|purry) depth-(3|10)|object pick\+omit\+set\+merge|array sortBy\+groupBy) \|/u;
const table = (header, rows) =>
  [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
const out = [];
const h = (text) => out.push("", text, "");

// --- A/A floors -------------------------------------------------------------
h("TABLE floors");
const floorRows = [];
const addFloor = (label, floors, calls) =>
  floorRows.push([
    label,
    ...[1, 2, 3].map((t) =>
      floors[t] ? `${f(floors[t].p95)} (n=${floors[t].n})` : "-",
    ),
    ...[1, 2, 3].map((t) =>
      calls[t]?.scenarios
        ? `${calls[t].calls}/${calls[t].scenarios} (${pct(calls[t].rate)}), bar ${calls[t].bar}`
        : "-",
    ),
  ]);
addFloor("full matrix (2 runs)", p.full.floors, p.full.aaFalseCalls);
addFloor("combo.patch (2 runs, T1+T2)", p.combo.floors, p.combo.aaFalseCalls);
addFloor(
  "variant batches pooled (42 runs)",
  p.variants.floorsPooled,
  p.variants.aaFalseCallsPooled,
);
for (const [b, x] of Object.entries(p.variants.perBatch))
  addFloor(`  batch ${b} (6 runs)`, x.floorsBatch, x.aaFalseCalls);
for (const [k, x] of Object.entries(p.extras))
  addFloor(`extra ${k} (2 runs)`, x.floors, x.aaFalseCalls);
out.push(
  table(
    [
      "runs",
      "T1 floor",
      "T2 floor",
      "T3 floor",
      "T1 A/A false calls",
      "T2 A/A false calls",
      "T3 A/A false calls",
    ],
    floorRows,
  ),
);

// --- Branch vs main per tier and group ----------------------------------------
const tierGroupTable = (summary, label) => {
  const rows = [];
  for (const t of [1, 2, 3]) {
    const s = summary[t];
    if (!s || s.n === 0) continue;
    rows.push([
      `**T${t} all**`,
      String(s.n),
      `**${f(s.geomean)}**`,
      Object.entries(s.counts)
        .map(([k, v]) => `${k} ${v}`)
        .join(", "),
      String(s.bar.length),
    ]);
    for (const g of GROUPS) {
      const x = s.groups[g];
      if (!x) continue;
      rows.push([
        `T${t} ${g}`,
        String(x.n),
        f(x.geomean),
        Object.entries(x.counts)
          .map(([k, v]) => `${k} ${v}`)
          .join(", "),
        String(x.bar),
      ]);
    }
  }
  return table([label, "n", "weighted gm", "verdicts", "bar"], rows);
};
h("TABLE branch-main-groups");
out.push(tierGroupTable(p.full.branchVsMain.summary, "tier / group"));

h("TABLE branch-violations");
out.push(
  table(
    [
      "tier",
      "scenario",
      "metric",
      "median",
      "branch first",
      "main first",
      "floor",
      "per run (r0, r1)",
    ],
    p.full.branchVsMain.violations.map((v) => [
      String(v.tier),
      short(v.key),
      v.metric,
      f(v.median),
      f(v.candidateFirst),
      f(v.referenceFirst),
      f(v.floor),
      v.perRun.map((r) => f(r.ratio)).join(", "),
    ]),
  ),
);

// --- G3 deopt modes -----------------------------------------------------------
h("TABLE g3-modes");
{
  const cfg = (run) =>
    run.startsWith("main/vb-")
      ? "variant batches (6 copies, vitest, dist)"
      : run.startsWith("main/full")
        ? "full matrix (3 copies, vitest, dist)"
        : run.startsWith("main/combo")
          ? "combo runs (4 copies, vitest, dist)"
          : `extra ${run.replace(/^main\/x-/u, "").replace(/-r\d$/u, "")}`;
  const groups = new Map();
  for (const m of modes) {
    if (m.mode === "") continue;
    const key = `${cfg(m.run)}|${/combo|on-demand|single-step/u.test(m.copy) ? "on-demand pipe (combo, pipe-on-demand-segments, pipe-single-step-runs)" : m.copy === "branch" ? "branch" : "other branch-pipe copies (variants)"}`;
    const g = groups.get(key) ?? { D: 0, f: 0, rD: [], rf: [] };
    g[m.mode] += 1;
    g[m.mode === "D" ? "rD" : "rf"].push(m.ratio);
    groups.set(key, g);
  }
  const gm = (l) =>
    l.length
      ? Math.exp(l.reduce((a, v) => a + Math.log(v), 0) / l.length)
      : undefined;
  out.push(
    table(
      [
        "configuration",
        "copies",
        "deopt mode (runs)",
        "fast mode (runs)",
        "gm deopt",
        "gm fast",
      ],
      [...groups].map(([k, g]) => {
        const [c, w] = k.split("|");
        return [c, w, String(g.D), String(g.f), f(gm(g.rD)), f(gm(g.rf))];
      }),
    ),
  );
}

// --- Combo ----------------------------------------------------------------------
h("TABLE combo-main-groups");
out.push(tierGroupTable(p.combo.comboVsMain.summary, "combo/main"));
h("TABLE combo-branch-groups");
out.push(tierGroupTable(p.combo.comboVsBranch.summary, "combo/branch"));
h("TABLE combo-fate");
out.push(
  table(
    [
      "tier",
      "branch violation in the combo runs",
      "branch/main",
      "combo/main",
      "combo verdict",
    ],
    p.combo.branchViolationFate.map((x) => [
      String(x.tier),
      short(x.key),
      f(x.branch),
      f(x.combo),
      x.comboVerdict,
    ]),
  ),
);
h("TABLE combo-entries");
out.push(
  table(
    ["tier", "scenario", "branch/main (r0, r1)", "combo/main (r0, r1)"],
    pb.comboEntries.map((x) => [
      String(x.tier),
      short(x.key),
      `${f(x.branch)} (${x.branchRuns.map((v) => f(v)).join(", ")})`,
      `${f(x.combo)} (${x.comboRuns.map((v) => f(v)).join(", ")})`,
    ]),
  ),
);

// --- Variants -------------------------------------------------------------------
h("TABLE variants");
out.push(
  table(
    [
      "variant",
      "batch",
      "flow n",
      "flow gm per run (r0..r5)",
      "overall",
      "faster runs",
      "T1 / T2 / T3 v/branch (no G3 cluster)",
      "bar violations vs main (official)",
      "inherited from the branch / new in the G3 cluster / other new",
      "losses vs branch (tier rule)",
      "A/A fire",
    ],
    p.variants.variants.map((v) => {
      const nog3 = pb.variantsNoG3[v.name];
      return [
        v.name,
        v.batch,
        String(v.flowSize),
        v.sign.perRun.map((x) => f(x)).join(", "),
        f(v.sign.overall, 4),
        `${v.sign.fasterRuns}/${v.sign.runs}`,
        [1, 2, 3].map((t) => f(nog3[t].geomean)).join(" / "),
        String(v.officialViolations.length),
        `${v.inherited.length} / ${v.newVsMain.filter((n) => G3C.test(n.key)).length} / ${
          v.newVsMain
            .filter((n) => !G3C.test(n.key))
            .map(
              (n) =>
                `T${n.tier} ${short(n.key)} ${f(n.variant)} (v/b ${f(n.variantOverBranch)})`,
            )
            .join("; ") || "0"
        }`,
        v.vsBranchBar.length === 0
          ? "none"
          : v.vsBranchBar
              .map((x) => `T${x.tier} ${short(x.key)} ${f(x.median)}`)
              .join("; "),
        pct(v.aaRate),
      ];
    }),
  ),
);

// --- Extras ---------------------------------------------------------------------
h("TABLE extras");
out.push(
  table(
    [
      "environment",
      "runtime",
      "T1 gm (n)",
      "T2 gm (n)",
      "T3 gm (n)",
      "floors T1/T2/T3",
      "bar violations (median; branch first / main first)",
    ],
    Object.entries(p.extras).map(([k, x]) => [
      k.replace(/^x-/u, ""),
      x.runs[0].node + (x.runs[0].flags ? ` ${x.runs[0].flags}` : ""),
      ...[1, 2, 3].map((t) =>
        x.summary[t].n ? `${f(x.summary[t].geomean)} (${x.summary[t].n})` : "-",
      ),
      [1, 2, 3].map((t) => f(x.floors[t]?.p95)).join("/"),
      x.violations.length === 0
        ? "none"
        : x.violations
            .map(
              (v) =>
                `T${v.tier} ${short(v.key)} ${f(v.median)} (${f(v.cf)}/${f(v.rf)})`,
            )
            .join("; "),
    ]),
  ),
);

// --- Bundle ---------------------------------------------------------------------
h("TABLE bundle");
{
  const copies = [
    "main",
    "branch",
    "branch-v-sentinel-module",
    "branch-v-identity-controls-v2",
    "branch-v-combo",
  ];
  out.push(
    table(
      [
        "import",
        "bundler",
        ...copies.map((c) => `${c.replace("branch-v-", "")} min/gzip`),
      ],
      bundle.rows.map((r) => [
        r.entry,
        r.bundler,
        ...copies.map((c) =>
          r[c]
            ? `${r[c].minified}/${r[c].gzip}${r[c].hasProxy ? " (sentinel)" : ""}`
            : "-",
        ),
      ]),
    ),
  );
}
process.stdout.write(`${out.join("\n")}\n`);
