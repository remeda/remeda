import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { sum } from "./sum";
import { take } from "./take";

// Often the values addition treats specially: `NaN`, `-0` (which the `0` seed
// turns into `0`), and the infinities.
const number = fc.oneof(
  fc.double(),
  fc.constantFrom(-0, NaN, Infinity, -Infinity),
);

// Both calling styles read a hole as `undefined`, which turns the sum into
// `NaN`.
const numbers = fc.oneof(fc.array(number), fc.sparseArray(number));

// Whole counts only: a lazy `take` rounds a fractional count up and takes
// everything for `NaN`, while data-first `take` slices.
const count = fc.integer({ min: -1, max: 32 });

test.prop([numbers])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = sum(data);

    expect(pipe(data, sum())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), sum())).toBe(dataFirst);
  },
);

test.prop([fc.array(fc.bigInt())])(
  "data-first and data-last produce the same result for bigints",
  (data) => {
    const dataFirst = sum(data);

    expect(pipe(data, sum())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), sum())).toBe(dataFirst);
  },
);

test.prop([numbers, count])(
  "taking a prefix in the pipe sums like data-first on the prefix",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), sum())).toBe(
      sum(take(data, prefixLength)),
    );
  },
);

test.prop([fc.array(fc.bigInt()), count])(
  "taking a prefix in the pipe sums like data-first on the prefix for bigints",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), sum())).toBe(
      sum(take(data, prefixLength)),
    );
  },
);

// A bigint next to a number, or next to a hole, fails the addition.
const mixed = fc.oneof(
  fc.array(fc.oneof(fc.integer(), fc.bigInt())),
  fc.sparseArray(fc.bigInt()),
);

test.prop([mixed])(
  "data-last throws like data-first",
  // @ts-expect-error [ts2345] -- The types reject mixing bigint and number, the property pins how the runtime fails.
  (data: readonly number[]) => {
    const dataFirst = outcomeOf(() => sum(data));

    expect(outcomeOf(() => pipe(data, sum()))).toStrictEqual(dataFirst);
    expect(outcomeOf(() => pipe(data, take(Infinity), sum()))).toStrictEqual(
      dataFirst,
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
