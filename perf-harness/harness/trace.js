// Callback tracing for validation (and the peak-heap hooks).
//
// `makeTracedLib(lib, recorder)` returns a view of a library copy whose
// functions wrap every callback a scenario hands them, so each callback call is
// recorded as
//
//   <input index>|<step id>|<call number>|<canonical arguments>
//
// The step id is `<utility>#<ordinal>.<argument position>`, where the ordinal
// counts utility calls since the batch input started, so it lines up across
// copies that run the same body. Arguments are recorded up to (not including)
// the callback's `data` parameter: main passes its prefix buffer there and the
// branch passes the prefix or a sentinel that throws on any access, so `data`
// differs by design and is never read here.
//
// The wrappers keep the callback's `length`, because the branch decides from
// it whether to collect `data`. Lazy steps handed to `pipe`/`piped` pass
// through untouched (their callbacks were wrapped when the step was built);
// plain functions handed to `pipe`/`piped` are traced on their input.

import { PROXY_ITEMS } from "./fixtures.js";

// Where each utility's callback receives `data` (default 2: value, index,
// data). Comparators of the *With utilities take no `data`.
const DATA_ARGUMENT_INDEX = {
  mapWithFeedback: 3,
  zipWith: 3,
  differenceWith: Number.POSITIVE_INFINITY,
  intersectionWith: Number.POSITIVE_INFINITY,
  uniqueWith: Number.POSITIVE_INFINITY,
};
const DEFAULT_DATA_ARGUMENT_INDEX = 2;

const STEP_HOSTS = new Set(["pipe", "piped"]);

// --- Fixture identities ------------------------------------------------------

const fixtureIds = new WeakMap();
let nextFixtureId = 0;

/**
 * Gives every object reachable from the datasets a stable id, in a fixed walk
 * order, so the same fixture object has the same label in every copy's trace.
 * Proxy items get an id but are never walked into (that would fire their
 * traps).
 */
export function registerFixtures(roots) {
  const stack = [...roots].reverse();
  while (stack.length > 0) {
    const value = stack.pop();
    if (typeof value !== "object" || value === null || fixtureIds.has(value)) {
      continue;
    }
    fixtureIds.set(value, nextFixtureId);
    nextFixtureId += 1;
    if (PROXY_ITEMS.has(value)) {
      continue;
    }
    const children = [];
    if (value instanceof Set || value instanceof Map) {
      children.push(...value.values());
    } else if (Array.isArray(value)) {
      for (const item of value) {
        children.push(item);
      }
    } else {
      for (const key of Object.keys(value)) {
        children.push(value[key]);
      }
    }
    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index]);
    }
  }
}

// --- Canonical values --------------------------------------------------------

/**
 * Primitives by value, fixture objects by id (`F<id>`), every other object by
 * its first-appearance number in this trace (`N<k>`, plus a shallow summary
 * the first time it appears), so two traces agree exactly when the callbacks
 * saw the same values with the same identity pattern.
 */
function canonical(value, labels, depth) {
  switch (typeof value) {
    case "undefined": {
      return "u";
    }
    case "boolean": {
      return value ? "T" : "F";
    }
    case "number": {
      return Object.is(value, -0) ? "n-0" : `n${value}`;
    }
    case "string": {
      return JSON.stringify(value);
    }
    case "bigint": {
      return `b${value}`;
    }
    case "symbol": {
      return `y(${String(value.description)})`;
    }
    case "function": {
      return "fn";
    }
    default: {
      break;
    }
  }
  if (value === null) {
    return "null";
  }
  const fixtureId = fixtureIds.get(value);
  if (fixtureId !== undefined) {
    return `F${fixtureId}`;
  }
  const known = labels.get(value);
  if (known !== undefined) {
    return known;
  }
  const label = `N${labels.size}`;
  labels.set(value, label);
  return depth > 0 ? label : `${label}${summarize(value, labels)}`;
}

function summarize(value, labels) {
  if (Array.isArray(value)) {
    const head = value
      .slice(0, 4)
      .map((item) => canonical(item, labels, 1))
      .join(",");
    return `A${value.length}[${head}]`;
  }
  if (value instanceof Set) {
    return `Set${value.size}`;
  }
  if (value instanceof Map) {
    return `Map${value.size}`;
  }
  const keys = Object.keys(value);
  const shown = keys
    .slice(0, 6)
    .map((key) => `${key}:${canonical(value[key], labels, 1)}`)
    .join(",");
  return `{${shown}${keys.length > 6 ? `,+${keys.length - 6}` : ""}}`;
}

// --- Recorder ----------------------------------------------------------------

/**
 * Collects trace entries. `onEntry(entry)` receives each one; by default they
 * are stored in `entries`.
 */
export class TraceRecorder {
  constructor({ onEntry, keepEntries = onEntry === undefined } = {}) {
    this.entries = [];
    this.count = 0;
    this.input = -1;
    this.ordinal = 0;
    this.labels = new Map();
    this.onEntry = onEntry;
    this.keepEntries = keepEntries;
  }

  beginInput(index) {
    this.input = index;
    this.ordinal = 0;
  }

  nextOrdinal() {
    const ordinal = this.ordinal;
    this.ordinal += 1;
    return ordinal;
  }

  record(stepId, callNumber, args, recordedCount) {
    const parts = [];
    const limit = Math.min(args.length, recordedCount);
    for (let position = 0; position < limit; position++) {
      parts.push(canonical(args[position], this.labels, 0));
    }
    const entry = `${this.input}|${stepId}|${callNumber}|${parts.join(",")}`;
    this.count += 1;
    if (this.keepEntries) {
      this.entries.push(entry);
    }
    this.onEntry?.(entry);
  }
}

/**
 * A recorder for hooks only: counts calls per step id and runs `onCall(stepId,
 * callNumber)` without building entries (the peak-heap script).
 */
export class CallHookRecorder {
  constructor(onCall) {
    this.input = -1;
    this.ordinal = 0;
    this.onCall = onCall;
  }

  beginInput(index) {
    this.input = index;
    this.ordinal = 0;
  }

  nextOrdinal() {
    const ordinal = this.ordinal;
    this.ordinal += 1;
    return ordinal;
  }

  record(stepId, callNumber) {
    this.onCall(`${this.input}|${stepId}`, callNumber);
  }
}

// --- Traced library view -----------------------------------------------------

function traceCallback(recorder, stepId, callback, recordedCount) {
  let calls = 0;
  const wrapper = function tracedCallback(...args) {
    calls += 1;
    recorder.record(stepId, calls, args, recordedCount);
    return callback.apply(this, args);
  };
  Object.defineProperty(wrapper, "length", { value: callback.length });
  return wrapper;
}

export function makeTracedLib(lib, recorder) {
  // Functions the library returned (data-last steps, `constant(0)`, ...) and
  // its exports. A pipe step from here is not a user callback.
  const fromLibrary = new WeakSet();

  const wrapArgument = (utility, ordinal, argument, position) => {
    if (typeof argument !== "function") {
      return argument;
    }
    const stepId = `${utility}#${ordinal}.${position}`;
    if (STEP_HOSTS.has(utility)) {
      return "lazy" in argument || fromLibrary.has(argument)
        ? argument
        : traceCallback(recorder, stepId, argument, 1);
    }
    return traceCallback(
      recorder,
      stepId,
      argument,
      DATA_ARGUMENT_INDEX[utility] ?? DEFAULT_DATA_ARGUMENT_INDEX,
    );
  };

  const traced = {};
  for (const name of Object.keys(lib)) {
    const original = lib[name];
    if (typeof original !== "function") {
      traced[name] = original;
      continue;
    }
    const wrapper = function tracedUtility(...args) {
      const ordinal = recorder.nextOrdinal();
      const forwarded = args.map((argument, position) =>
        wrapArgument(name, ordinal, argument, position),
      );
      const result = original.apply(this, forwarded);
      if (typeof result === "function") {
        fromLibrary.add(result);
      }
      return result;
    };
    Object.defineProperty(wrapper, "length", { value: original.length });
    Object.defineProperty(wrapper, "name", { value: original.name });
    fromLibrary.add(wrapper);
    traced[name] = wrapper;
  }
  return traced;
}
