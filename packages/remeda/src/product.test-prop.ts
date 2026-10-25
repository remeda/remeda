import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { product } from "./product";
import { take } from "./take";

// Often the values multiplication treats specially: `NaN`, `-0` (which the
// `1` seed keeps), and the infinities (which turn into `NaN` next to a `0`).
const number = fc.oneof(
  fc.double(),
  fc.constantFrom(-0, 0, NaN, Infinity, -Infinity),
);

// Both calling styles read a hole as `undefined`, which turns the product into
// `NaN`.
const numbers = fc.oneof(fc.array(number), fc.sparseArray(number));

const count = fc.integer({ min: -1, max: 32 });

test.prop([numbers])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = product(data);

    expect(pipe(data, product())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), product())).toBe(dataFirst);
  },
);

test.prop([fc.array(fc.bigInt())])(
  "data-first and data-last produce the same result for bigints",
  (data) => {
    const dataFirst = product(data);

    expect(pipe(data, product())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), product())).toBe(dataFirst);
  },
);

test.prop([numbers, count])(
  "taking a prefix in the pipe multiplies like data-first on the prefix",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), product())).toBe(
      product(take(data, prefixLength)),
    );
  },
);

test.prop([fc.array(fc.bigInt()), count])(
  "taking a prefix in the pipe multiplies like data-first on the prefix for bigints",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), product())).toBe(
      product(take(data, prefixLength)),
    );
  },
);

// A bigint next to a number, or next to a hole, fails the multiplication.
const mixed = fc.oneof(
  fc.array(fc.oneof(fc.integer(), fc.bigInt())),
  fc.sparseArray(fc.bigInt()),
);

test.prop([mixed])(
  "data-last throws like data-first",
  // @ts-expect-error [ts2345] -- The types reject mixing bigint and number, the property pins how the runtime fails.
  (data: readonly number[]) => {
    const dataFirst = outcomeOf(() => product(data));

    expect(outcomeOf(() => pipe(data, product()))).toStrictEqual(dataFirst);
    expect(
      outcomeOf(() => pipe(data, take(Infinity), product())),
    ).toStrictEqual(dataFirst);
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
