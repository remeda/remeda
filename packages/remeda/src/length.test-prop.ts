import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { length } from "./length";
import { pipe } from "./pipe";
import { take } from "./take";

// Both calling styles count a hole as an item.
const items = fc.oneof(fc.array(fc.anything()), fc.sparseArray(fc.anything()));

// Whole counts only: a lazy `take` rounds a fractional count up and takes
// everything for `NaN`, while data-first `take` slices.
const count = fc.integer({ min: -1, max: 32 });

test.prop([items])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = length(data);

    expect(pipe(data, length())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), length())).toBe(dataFirst);
  },
);

test.prop([items, count])(
  "taking a prefix in the pipe counts like data-first on the prefix",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), length())).toBe(
      length(take(data, prefixLength)),
    );
  },
);

// The `length` of an ArrayLike is returned as is, even when it isn't a count
// of anything. Not being iterable, it has no `take` form.
test.prop([fc.record({ length: fc.oneof(fc.nat(), fc.double()) })])(
  "data-last reads an ArrayLike like data-first",
  (data) => {
    expect(pipe(data, length())).toBe(length(data));
  },
);

// A Set has no `length`, so it is counted by iterating it.
test.prop([fc.array(fc.anything()).map((values) => new Set(values))])(
  "data-last counts a Set like data-first",
  (data) => {
    expect(pipe(data, length())).toBe(length(data));
  },
);

// The `take` form is left out: its types reject a string, and its lazy step
// iterates the string's characters instead of throwing.
test.prop([fc.string()])(
  "data-last throws like data-first on a string",
  (data) => {
    expect(outcomeOf(() => pipe(data, length()))).toStrictEqual(
      outcomeOf(() => length(data)),
    );
  },
);

// What `run` returned or threw, so calls that might fail can be compared:
// strict equality compares errors by class and message.
function outcomeOf(
  run: () => unknown,
): Readonly<{ returned: unknown } | { threw: unknown }> {
  try {
    return { returned: run() };
  } catch (error) {
    return { threw: error };
  }
}
