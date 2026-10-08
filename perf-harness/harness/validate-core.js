// Validation shared by scripts/validate.mjs (plain runtime, built copies) and
// validate/validate.test.js (vitest, any source):
//
//   outputs  every copy (and native) runs every selected (scenario, size) once
//            and is deep-compared with main;
//   traces   every callback call is recorded per copy (harness/trace.js) and
//            the traces are diffed: main-aa and branch against main, every
//            other branch copy (variants, the combination) against branch;
//   traps    for scenarios over the pass-through Proxy items, the trap counts
//            of each copy's run;
//   cross    (scripts/validate.mjs only) a pipe from one branch-protocol copy
//            running steps built by another, which must recognize each
//            other's control objects through the registered symbol.

import { isDeepStrictEqual } from "node:util";
import { datasetsFor, TRAP_COUNTS } from "./fixtures.js";
import { makeTracedLib, registerFixtures, TraceRecorder } from "./trace.js";

/** [candidate, reference] pairs whose callback traces must match. */
export function tracePairs(copies) {
  const pairs = [];
  for (const id of copies) {
    if (id === "main") {
      continue;
    }
    if (id === "main-aa" || id === "branch" || !copies.includes("branch")) {
      pairs.push([id, "main"]);
    } else {
      pairs.push([id, id.startsWith("branch") ? "branch" : "main"]);
    }
  }
  return pairs.filter(([, reference]) => copies.includes(reference));
}

function summarize(value) {
  if (Array.isArray(value)) {
    const inner = value.length > 0 ? summarize(value[0]) : "-";
    const missing = value.filter((item) => item === undefined).length;
    return `array(${value.length})<${inner}>${missing > 0 ? ` (${missing} undefined)` : ""}`;
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    return `object{${Object.keys(value).slice(0, 4).join(",")}}`;
  }
  return typeof value;
}

function firstDifference(expected, actual) {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return `length ${actual.length} vs ${expected.length}`;
    }
    for (let index = 0; index < expected.length; index++) {
      if (!isDeepStrictEqual(expected[index], actual[index])) {
        return `index ${index}: ${firstDifference(expected[index], actual[index])}`;
      }
    }
  }
  return `${summarize(actual)} vs ${summarize(expected)}`;
}

function runOnce(makeClosure) {
  try {
    // Clone the batch container: the measured closure reuses it across calls.
    const result = makeClosure()();
    return { ok: true, value: Array.isArray(result) ? [...result] : result };
  } catch (error) {
    return { ok: false, error: String(error?.stack ?? error) };
  }
}

function traceOf(entry, copy, lib) {
  const recorder = new TraceRecorder();
  try {
    entry.runEach(copy, {
      lib: makeTracedLib(lib, recorder),
      beforeEach: (index) => recorder.beginInput(index),
    })();
    return { ok: true, entries: recorder.entries };
  } catch (error) {
    return {
      ok: false,
      entries: recorder.entries,
      error: String(error?.stack ?? error),
    };
  }
}

function compareTrace(entry, copy, lib, expected) {
  let position = 0;
  let mismatch;
  const recorder = new TraceRecorder({
    keepEntries: false,
    onEntry: (actual) => {
      if (mismatch === undefined && actual !== expected[position]) {
        mismatch = {
          position,
          expected: expected[position] ?? "<end of trace>",
          actual,
          before: expected.slice(Math.max(0, position - 3), position),
        };
      }
      position += 1;
    },
  });
  let error;
  try {
    entry.runEach(copy, {
      lib: makeTracedLib(lib, recorder),
      beforeEach: (index) => recorder.beginInput(index),
    })();
  } catch (thrown) {
    error = String(thrown?.stack ?? thrown);
  }
  if (mismatch === undefined && position !== expected.length) {
    mismatch = {
      position,
      expected: expected[position] ?? "<end of trace>",
      actual: "<end of trace>",
      before: expected.slice(Math.max(0, position - 3), position),
    };
  }
  return {
    calls: position,
    expectedCalls: expected.length,
    mismatch,
    error,
  };
}

/**
 * @param {object} options
 * @param {Map<string, object>} options.libs - copy id -> namespace.
 * @param {readonly object[]} options.entries - registry entries.
 * @param {readonly string[]} options.copies - copies to validate (main first).
 * @param {(line: string) => void} [options.log]
 */
export function validateScenarios({ libs, entries, copies, log = () => {} }) {
  const pairs = tracePairs(copies);
  const referenceIds = [...new Set(pairs.map(([, reference]) => reference))];
  const outputMismatches = [];
  const traceMismatches = [];
  const traps = [];
  const rows = [];
  const registeredSizes = new Set();
  let traceCalls = 0;

  for (const entry of entries) {
    if (!registeredSizes.has(entry.size)) {
      registerFixtures(datasetsFor(entry.size));
      registeredSizes.add(entry.size);
    }

    // Outputs (and trap counts for the Proxy scenarios).
    const results = {};
    const trapCounts = {};
    const countsTraps = entry.tags.includes("traps");
    for (const copy of copies) {
      TRAP_COUNTS.has = 0;
      TRAP_COUNTS.get = 0;
      results[copy] = runOnce(() => entry.run(copy));
      if (countsTraps) {
        trapCounts[copy] = { ...TRAP_COUNTS };
      }
    }
    if (entry.native !== undefined) {
      TRAP_COUNTS.has = 0;
      TRAP_COUNTS.get = 0;
      results.native = runOnce(entry.native);
      if (countsTraps) {
        trapCounts.native = { ...TRAP_COUNTS };
      }
    }
    if (countsTraps) {
      traps.push({ key: entry.key, counts: trapCounts });
    }
    const main = results.main;
    for (const [label, result] of Object.entries(results)) {
      if (!result.ok) {
        outputMismatches.push({
          key: entry.key,
          copy: label,
          detail: `threw: ${result.error}`,
        });
        continue;
      }
      if (label === "main" || !main.ok) {
        continue;
      }
      if (!isDeepStrictEqual(main.value, result.value)) {
        outputMismatches.push({
          key: entry.key,
          copy: label,
          detail: firstDifference(main.value, result.value),
        });
      }
    }

    // Callback traces.
    const references = {};
    for (const id of referenceIds) {
      references[id] = traceOf(entry, id, libs.get(id));
      if (!references[id].ok) {
        traceMismatches.push({
          key: entry.key,
          copy: id,
          against: "-",
          detail: `threw while tracing: ${references[id].error}`,
        });
      }
    }
    const traceRow = {};
    for (const [copy, reference] of pairs) {
      const expected = references[reference];
      if (!expected.ok) {
        continue;
      }
      const comparison = compareTrace(
        entry,
        copy,
        libs.get(copy),
        expected.entries,
      );
      traceCalls += comparison.calls;
      traceRow[copy] = comparison.calls;
      if (comparison.mismatch !== undefined || comparison.error !== undefined) {
        traceMismatches.push({
          key: entry.key,
          copy,
          against: reference,
          calls: comparison.calls,
          expectedCalls: comparison.expectedCalls,
          ...comparison.mismatch,
          ...(comparison.error === undefined
            ? {}
            : { error: comparison.error }),
        });
      }
    }
    for (const id of referenceIds) {
      traceRow[id] ??= references[id].entries.length;
    }

    rows.push({
      key: entry.key,
      tier: entry.tier,
      shape: main.ok ? summarize(main.value) : "threw",
      compared: Object.keys(results).join(","),
      calls: traceRow,
    });
    log(
      `${entry.key.padEnd(72)} ${rows.at(-1).shape.padEnd(36)} calls ${JSON.stringify(traceRow)}`,
    );
  }

  return {
    scenarios: rows.length,
    pairs,
    traceCalls,
    outputMismatches,
    traceMismatches,
    traps,
    rows,
  };
}

// --- Cross-copy control objects ---------------------------------------------

const CROSS_CASES = {
  "filter step (skip)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.filter((user) => user.isActive),
      pipeLib.map((user) => user.name),
    ),
  "take step (stop)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      pipeLib.map((user) => user),
      stepLib.take(3),
    ),
  "take(0) step (stop without a value)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.take(0),
      pipeLib.map((user) => user.id),
    ),
  "flatMap step (many)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.orders,
      stepLib.flatMap((order) => order.items),
      pipeLib.map((item) => item.price),
    ),
  "find step (last, single)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      pipeLib.filter((user) => user.isActive),
      stepLib.find((user) => user.age > 40),
    ),
  "filter + first steps": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.filter((user) => user.age > 30),
      stepLib.first(),
    ),
  "single step from the other copy": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.filter((user) => user.isActive),
    ),
  "uniqueWith step (collects data)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.uniqueWith((a, b) => a.email === b.email),
      pipeLib.map((user) => user.id),
    ),
  "zipWith step (last value at the end)": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.numbers,
      stepLib.zipWith(d.partnerNumbers.slice(0, 5), (a, b) => a + b),
      pipeLib.map((value) => value + 1),
    ),
  "piped from the other copy": (pipeLib, stepLib, d) =>
    pipeLib.pipe(
      d.users,
      stepLib.piped(
        stepLib.filter((user) => user.isActive),
        pipeLib.map((user) => user.name),
      ),
    ),
};

/**
 * @param {readonly { label: string, pipeLib: object, stepLib: object }[]} pairs
 */
export function crossCopyChecks(pairs) {
  const datasets = [...datasetsFor("XS"), ...datasetsFor("C")];
  const results = [];
  for (const { label, pipeLib, stepLib } of pairs) {
    for (const [name, run] of Object.entries(CROSS_CASES)) {
      let detail;
      for (const [index, dataset] of datasets.entries()) {
        let expected;
        let actual;
        try {
          expected = run(pipeLib, pipeLib, dataset);
        } catch (error) {
          detail = `input ${index}: same-copy run threw: ${String(error)}`;
          break;
        }
        try {
          actual = run(pipeLib, stepLib, dataset);
        } catch (error) {
          detail = `input ${index}: mixed run threw: ${String(error)}`;
          break;
        }
        if (!isDeepStrictEqual(expected, actual)) {
          detail = `input ${index}: ${firstDifference(expected, actual)}`;
          break;
        }
      }
      results.push({
        pair: label,
        case: name,
        ok: detail === undefined,
        detail,
      });
    }
  }
  return results;
}
