// Validation over the built copies, outside vitest (harness/validate-core.js
// has the checks). scripts/prepare.mjs runs it after every rebuild.
//
//   node scripts/validate.mjs [--source dist|cjs|bundle]
//     [--copies main,branch,main-aa,...] [--groups G1,G2] [--sizes S,C]
//     [--ids <regex>] [--out results/validate-dist.json] [--quiet]
//
// Default copies: every copy under libs/ that prepare.mjs didn't mark failed.
// Exits 1 when main, main-aa or branch fail; a failing variant copy is only
// listed under `failedCopies` (prepare.mjs then excludes it).

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    source: { type: "string", default: "dist" },
    copies: { type: "string", default: "" },
    groups: { type: "string", default: "" },
    sizes: { type: "string", default: "" },
    ids: { type: "string", default: "" },
    out: { type: "string", default: "" },
    quiet: { type: "boolean", default: false },
  },
});

if (values.source === "src") {
  throw new Error(
    "--source src needs vitest's transform: run the validate project (see README)",
  );
}

// The selection is read from the environment by harness/env.js.
Object.assign(process.env, {
  PERF_SOURCE: values.source,
  PERF_GROUPS: values.groups,
  PERF_SIZES: values.sizes,
  PERF_IDS: values.ids,
  PERF_LIBS: "",
  PERF_TIERS: "",
  PERF_TARGETS: "",
  PERF_SUBSET: "",
  PERF_TAGS: "",
});

const { copyUsable, isVariantCopy, listCopies, PERF_DIR, readVariantsIndex } =
  await import("../harness/copies.js");
const { isSelected } = await import("../harness/env.js");
const { loadLib } = await import("../harness/libs.js");
const { buildRegistry } = await import("../harness/registry.js");
const { crossCopyChecks, validateScenarios } =
  await import("../harness/validate-core.js");
const { popularityData } = await import("../harness/tiers.js");

const copies =
  values.copies === ""
    ? listCopies().filter((id) => copyUsable(id))
    : values.copies.split(",").filter((id) => id !== "");
if (!copies.includes("main")) {
  throw new Error("validation needs the main copy");
}
const ordered = ["main", ...copies.filter((id) => id !== "main")];

const started = performance.now();
const { libs, entries } = await buildRegistry({
  libIds: ordered,
  filter: isSelected,
  source: values.source,
});

const log = values.quiet
  ? () => {}
  : (line) => {
      process.stdout.write(`[validate] ${line}\n`);
    };

const report = validateScenarios({ libs, entries, copies: ordered, log });

// Cross-copy control objects: a pipe of one branch-protocol copy with steps
// built by another. The CJS build of the same copy is a separate module
// instance (as when an app loads both builds); variants are separate copies.
const crossPairs = [];
if (ordered.includes("branch")) {
  const branchCjs = await loadLib("branch", "cjs");
  const branchMain = libs.get("branch");
  if (values.source !== "cjs") {
    crossPairs.push(
      {
        label: "branch pipe + branch (cjs) steps",
        pipeLib: branchMain,
        stepLib: branchCjs,
      },
      {
        label: "branch (cjs) pipe + branch steps",
        pipeLib: branchCjs,
        stepLib: branchMain,
      },
    );
  }
  // Variants that change the control protocol itself (index.json `protocol:
  // "own"`) are not meant to understand the branch's control objects (nor
  // the branch theirs); what they must keep is recognition across module
  // instances of their own protocol, so they pair with their other build.
  const ownProtocol = new Set(
    readVariantsIndex()
      .filter((variant) => variant.protocol === "own")
      .map((variant) => variant.copyId),
  );
  for (const id of ordered.filter((candidate) => isVariantCopy(candidate))) {
    if (ownProtocol.has(id)) {
      const otherBuild = await loadLib(
        id,
        values.source === "cjs" ? "dist" : "cjs",
      );
      const otherLabel = values.source === "cjs" ? "esm" : "cjs";
      crossPairs.push(
        {
          label: `${id} pipe + ${id} (${otherLabel}) steps`,
          pipeLib: libs.get(id),
          stepLib: otherBuild,
        },
        {
          label: `${id} (${otherLabel}) pipe + ${id} steps`,
          pipeLib: otherBuild,
          stepLib: libs.get(id),
        },
      );
      continue;
    }
    crossPairs.push(
      {
        label: `branch pipe + ${id} steps`,
        pipeLib: branchMain,
        stepLib: libs.get(id),
      },
      {
        label: `${id} pipe + branch steps`,
        pipeLib: libs.get(id),
        stepLib: branchMain,
      },
    );
  }
}
const cross = crossCopyChecks(crossPairs);

const failedCopies = new Set();
for (const mismatch of [
  ...report.outputMismatches,
  ...report.traceMismatches,
]) {
  if (mismatch.copy !== "native") {
    failedCopies.add(mismatch.copy);
  }
}
for (const result of cross.filter((candidate) => !candidate.ok)) {
  // The pair label starts with the copy whose pipe ran; blame both copies of
  // a variant pair, and branch only for its own (cjs) pairs.
  const variant = result.pair.match(/branch-v-[\w.-]+/u)?.[0];
  failedCopies.add(variant ?? "branch");
}
const nativeMismatches = report.outputMismatches.filter(
  (mismatch) => mismatch.copy === "native",
);

const outFile =
  values.out === ""
    ? path.join(PERF_DIR, "results", `validate-${values.source}.json`)
    : path.resolve(values.out);
mkdirSync(path.dirname(outFile), { recursive: true });
const summary = {
  source: values.source,
  copies: ordered,
  scenarios: report.scenarios,
  tracePairs: report.pairs,
  traceCalls: report.traceCalls,
  failedCopies: [...failedCopies],
  outputMismatches: report.outputMismatches,
  traceMismatches: report.traceMismatches,
  crossCopy: cross,
  traps: report.traps,
  popularity: popularityData().source,
  wallMs: Math.round(performance.now() - started),
  rows: report.rows,
};
writeFileSync(outFile, `${JSON.stringify(summary, undefined, 2)}\n`);

for (const mismatch of report.outputMismatches) {
  process.stdout.write(
    `[validate] OUTPUT MISMATCH ${mismatch.key} (${mismatch.copy}): ${mismatch.detail}\n`,
  );
}
for (const mismatch of report.traceMismatches) {
  process.stdout.write(
    `[validate] TRACE MISMATCH ${mismatch.key} (${mismatch.copy} vs ${mismatch.against}): ` +
      `call ${mismatch.position} of ${mismatch.expectedCalls}: expected ${mismatch.expected} got ${mismatch.actual}` +
      `${mismatch.error === undefined ? "" : ` [threw: ${mismatch.error.split("\n")[0]}]`}\n`,
  );
}
for (const result of cross.filter((candidate) => !candidate.ok)) {
  process.stdout.write(
    `[validate] CROSS-COPY FAILURE ${result.pair}: ${result.case}: ${result.detail}\n`,
  );
}
for (const { key, counts } of report.traps) {
  process.stdout.write(
    `[validate] traps ${key}: ${Object.entries(counts)
      .map(([copy, count]) => `${copy} has=${count.has} get=${count.get}`)
      .join(" | ")}\n`,
  );
}
process.stdout.write(
  `[validate] source=${values.source} copies=${ordered.join(",")} scenarios=${report.scenarios} ` +
    `trace pairs=${report.pairs.map(([copy, reference]) => `${copy}~${reference}`).join(",")} ` +
    `traced calls=${report.traceCalls} output mismatches=${report.outputMismatches.length} ` +
    `(native ${nativeMismatches.length}) trace mismatches=${report.traceMismatches.length} ` +
    `cross-copy ${cross.filter((result) => result.ok).length}/${cross.length} ok ` +
    `failed copies=[${[...failedCopies].join(",")}] in ${(summary.wallMs / 1000).toFixed(1)}s\n` +
    `[validate] report written to ${outFile}\n`,
);

const blocking = ["main", "main-aa", "branch"].filter((id) =>
  failedCopies.has(id),
);
process.exitCode = blocking.length > 0 || nativeMismatches.length > 0 ? 1 : 0;
