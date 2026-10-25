import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { reduce } from "./reduce";
import { take } from "./take";

// Few distinct values, so repeated items are common, among them `NaN`, `-0`
// next to `0`, and two objects of the same shape.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Dense only: native `reduce` skips holes, while a lazy step reads them as
// `undefined`.
const items = fc.array(item);

// Accumulators that only `Object.is` tells apart from a regular number.
const accumulated = fc.oneof(fc.integer(), fc.constantFrom(-0, NaN));

const count = fc.integer({ min: -1, max: 32 });

test.prop([items, fc.func(accumulated), accumulated])(
  "data-first and data-last produce the same result",
  (data, reducerOf, initialValue) => {
    // The reducer ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const reducer = (
      accumulator: number,
      value: unknown,
      index: number,
    ): number => reducerOf(accumulator, value, index);

    const dataFirst = reduce(data, reducer, initialValue);

    expect(pipe(data, reduce(reducer, initialValue))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), reduce(reducer, initialValue))).toBe(
      dataFirst,
    );
  },
);

test.prop([items, fc.func(accumulated), accumulated, count])(
  "taking a prefix in the pipe reduces like data-first on the prefix",
  (data, reducerOf, initialValue, prefixLength) => {
    const reducer = (
      accumulator: number,
      value: unknown,
      index: number,
    ): number => reducerOf(accumulator, value, index);

    expect(pipe(data, take(prefixLength), reduce(reducer, initialValue))).toBe(
      reduce(take(data, prefixLength), reducer, initialValue),
    );
  },
);

test.prop([items, fc.func(fc.boolean())])(
  "data-last throws like data-first",
  (data, throwsOn) => {
    // Named after the call, so throwing from a different call fails
    // differently.
    const reducer = (
      accumulator: number,
      value: unknown,
      index: number,
    ): number => {
      if (throwsOn(value, index)) {
        throw new Error(`Reducer threw at ${index}`);
      }

      return accumulator + index;
    };

    const dataFirst = outcomeOf(() => reduce(data, reducer, 0));

    expect(outcomeOf(() => pipe(data, reduce(reducer, 0)))).toStrictEqual(
      dataFirst,
    );
    expect(
      outcomeOf(() => pipe(data, take(Infinity), reduce(reducer, 0))),
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
