import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { meanBy } from "./meanBy";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, so repeated items are common, among them `NaN`, `-0`
// next to `0`, and two objects of the same shape.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Often the values the mean treats specially: `-0`, which the `0` seed turns
// into `0`, `NaN`, and the infinities.
const mappedNumber = fc.oneof(
  fc.double(),
  fc.constantFrom(-0, NaN, Infinity, -Infinity),
);

// Whole counts only: a lazy `take` rounds a fractional count up and takes
// everything for `NaN`, while data-first `take` slices.
const count = fc.integer({ min: -1, max: 32 });

test.prop([items, fc.func(mappedNumber)])(
  "data-first and data-last produce the same result",
  (data, mapperOf) => {
    // The mapper ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const mapper = (value: unknown, index: number): number =>
      mapperOf(value, index);

    const dataFirst = meanBy(data, mapper);

    expect(pipe(data, meanBy(mapper))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), meanBy(mapper))).toBe(dataFirst);
  },
);

test.prop([items, fc.func(mappedNumber), count])(
  "taking a prefix in the pipe averages like data-first on the prefix",
  (data, mapperOf, prefixLength) => {
    const mapper = (value: unknown, index: number): number =>
      mapperOf(value, index);

    expect(pipe(data, take(prefixLength), meanBy(mapper))).toBe(
      meanBy(take(data, prefixLength), mapper),
    );
  },
);

test.prop([items, fc.func(fc.boolean())])(
  "data-last throws like data-first",
  (data, throwsOn) => {
    // Named after the call, so throwing from a different call fails
    // differently.
    const mapper = (value: unknown, index: number): number => {
      if (throwsOn(value, index)) {
        throw new Error(`Mapper threw at ${index}`);
      }

      return index;
    };

    const dataFirst = outcomeOf(() => meanBy(data, mapper));

    expect(outcomeOf(() => pipe(data, meanBy(mapper)))).toStrictEqual(
      dataFirst,
    );
    expect(
      outcomeOf(() => pipe(data, take(Infinity), meanBy(mapper))),
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
