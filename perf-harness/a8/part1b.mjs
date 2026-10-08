// Extra numbers: tier effects without the G3 deopt cluster; selected combo entries.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PERF,
  TIERS,
  loadRuns,
  buildScenarios,
  floorsOf,
  evaluate,
  geomean,
  fmt,
} from "./lib.mjs";
const R = path.join(PERF, "results/main");
const files = (re) =>
  readdirSync(R)
    .filter((f) => re.test(f))
    .sort()
    .map((f) => path.join(R, f));
const G3_CLUSTER =
  /^G3 \| (scalar (arrows|purry) depth-(3|10)|object pick\+omit\+set\+merge|array sortBy\+groupBy) \|/u;
const out = {};
// Variants: tier geomeans vs branch without the G3 cluster, per batch.
{
  const runs = loadRuns(files(/^vb-b\d-r\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const batchOf = (run) => run.name.match(/vb-(b\d)-/u)[1];
  out.variantsNoG3 = {};
  for (const b of [...new Set(runs.map(batchOf))]) {
    const filter = (run) => batchOf(run) === b;
    const copies = runs
      .find(filter)
      .order.filter((c) => c.startsWith("branch-v-"));
    for (const copy of copies) {
      const ev = scenarios
        .map((s) => evaluate(s, copy, "branch", floors, filter))
        .filter(Boolean)
        .filter((e) => !G3_CLUSTER.test(e.key));
      const res = {};
      for (const t of TIERS) {
        const rows = ev.filter((e) => e.tier === t);
        res[t] = {
          n: rows.length,
          geomean: geomean(
            rows.map((r) => r.median),
            rows.map((r) => r.weight),
          ),
        };
      }
      out.variantsNoG3[copy.replace("branch-v-", "")] = res;
      console.log(
        copy.padEnd(40),
        TIERS.map((t) => `T${t} n${res[t].n} ${fmt(res[t].geomean)}`).join(
          " | ",
        ),
      );
    }
  }
}
// Full matrix: branch tiers without the G3 cluster.
{
  const runs = loadRuns(files(/^full-r\d-c\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const ev = scenarios
    .map((s) => evaluate(s, "branch", "main", floors))
    .filter(Boolean)
    .filter((e) => !G3_CLUSTER.test(e.key));
  out.fullNoG3 = {};
  for (const t of TIERS) {
    const rows = ev.filter((e) => e.tier === t);
    out.fullNoG3[t] = {
      n: rows.length,
      geomean: geomean(
        rows.map((r) => r.median),
        rows.map((r) => r.weight),
      ),
    };
  }
  console.log(
    "full branch/main without G3 cluster",
    JSON.stringify(out.fullNoG3),
  );
}
// Combo runs: selected entries, combo/main and branch/main.
{
  const runs = loadRuns(files(/^combo-r\d\.json$/u));
  const scenarios = buildScenarios(runs);
  const floors = floorsOf(scenarios);
  const pick =
    /G1 \| 3-step middle reads data \| XS|G9 \| map\(\(\.\.\.args\) => args\[0\]\)\+filter \| XS|G1b \| pipe zip\+map \| (XS|S)|G7 \| clamp data-last \| C|G7 \| mergeDeep data-last \| C|G1 \| filter\+map \| XS|G1b \| pipe filter\+map \| XS|G1b \| pipe difference\+map \| XS|G7 \| mapValues data-first \| C|G7 \| isDeepEqual data-last \| C|G7 \| mapValues data-last \| C/u;
  out.comboEntries = [];
  for (const s of scenarios.filter((x) => pick.test(x.key))) {
    const c = evaluate(s, "branch-v-combo", "main", floors);
    const b = evaluate(s, "branch", "main", floors);
    out.comboEntries.push({
      key: s.key,
      tier: s.tier,
      combo: c?.median,
      comboRuns: c?.rows.map((r) => r.ratio),
      branch: b?.median,
      branchRuns: b?.rows.map((r) => r.ratio),
    });
    console.log(
      s.key.padEnd(56),
      `T${s.tier}`,
      "combo/main",
      fmt(c?.median),
      c?.rows.map((r) => fmt(r.ratio)).join(","),
      "branch/main",
      fmt(b?.median),
      b?.rows.map((r) => fmt(r.ratio)).join(","),
    );
  }
}
writeFileSync(
  path.join(PERF, "a8/part1b.json"),
  `${JSON.stringify(out, undefined, 1)}\n`,
);
