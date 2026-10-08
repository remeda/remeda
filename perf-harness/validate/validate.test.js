// Validation under vitest, so the TS sources (PERF_SOURCE=src, the default)
// can be validated too; scripts/validate.mjs covers the built copies without
// vitest. Both run harness/validate-core.js: every copy's output deep-compared
// with main, and every copy's callback trace diffed against its reference.
//
// Copies: PERF_LIBS (default main,branch,main-aa); PERF_GROUPS / PERF_SIZES /
// PERF_IDS narrow the matrix.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { config, isSelected, PERF_DIR } from "../harness/env.js";
import { describeLoader } from "../harness/libs.js";
import { buildRegistry } from "../harness/registry.js";
import { validateScenarios } from "../harness/validate-core.js";

const copies = ["main", ...config.libs.filter((id) => id !== "main")];

const { libs, entries } = await buildRegistry({
  libIds: copies,
  filter: isSelected,
});

test("all copies agree on every scenario's output and callback trace", () => {
  const lines = [];
  const report = validateScenarios({
    libs,
    entries,
    copies,
    log: (line) => lines.push(line),
  });

  const outFile = path.join(
    PERF_DIR,
    "results",
    `validate-vitest-${config.source}.json`,
  );
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(
    outFile,
    `${JSON.stringify({ source: config.source, copies, ...report }, undefined, 2)}\n`,
  );

  process.stdout.write(
    `\n[validate] source=${config.source} loader=${[...libs.values()].map(describeLoader).join(",")} ` +
      `scenarios=${report.scenarios} traced calls=${report.traceCalls} ` +
      `output mismatches=${report.outputMismatches.length} trace mismatches=${report.traceMismatches.length}\n` +
      `${lines.map((line) => `[validate] ${line}`).join("\n")}\n`,
  );
  for (const mismatch of report.outputMismatches) {
    process.stdout.write(
      `[validate] OUTPUT MISMATCH ${mismatch.key} (${mismatch.copy}): ${mismatch.detail}\n`,
    );
  }
  for (const mismatch of report.traceMismatches) {
    process.stdout.write(
      `[validate] TRACE MISMATCH ${mismatch.key} (${mismatch.copy} vs ${mismatch.against}): ` +
        `call ${mismatch.position}: expected ${mismatch.expected} got ${mismatch.actual}\n`,
    );
  }
  process.stdout.write(`[validate] report written to ${outFile}\n`);

  expect(report.outputMismatches).toEqual([]);
  expect(report.traceMismatches).toEqual([]);
});
