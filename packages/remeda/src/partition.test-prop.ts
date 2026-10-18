import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { partition } from "./partition";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, isIncluded) => {
    // The predicate ignores `data`, which differs between the calling styles
    // on purpose: the whole input data-first, the items so far in `pipe`.
    const predicate = (value: unknown, index: number): boolean =>
      isIncluded(value, index);

    const dataFirst = partition(data, predicate);

    expectSamePartition(pipe(data, partition(predicate)), dataFirst);
    expectSamePartition(
      pipe(data, take(Infinity), partition(predicate)),
      dataFirst,
    );
  },
);

test.prop([items, fc.func(fc.boolean()), count])(
  "data-last after `take` partitions the taken prefix",
  (data, isIncluded, takeCount) => {
    const predicate = (value: unknown, index: number): boolean =>
      isIncluded(value, index);

    expectSamePartition(
      pipe(data, take(takeCount), partition(predicate)),
      partition(take(data, takeCount), predicate),
    );
  },
);

test.prop([items, fc.func(fc.boolean()), fc.func(fc.boolean())])(
  "data-last throws what data-first throws",
  (data, isIncluded, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const predicate = (value: unknown, index: number): boolean => {
      if (throwsAt(value, index)) {
        throw new RangeError(`No partition for the item at ${index}`);
      }

      return isIncluded(value, index);
    };

    const expected = thrownBy(() => partition(data, predicate));

    expect(thrownBy(() => pipe(data, partition(predicate)))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), partition(predicate))),
    ).toStrictEqual(expected);
  },
);

type Partition = readonly [readonly unknown[], readonly unknown[]];

// Deep equality can't tell the two objects of the same shape apart.
function expectSamePartition(actual: Partition, expected: Partition): void {
  expect(actual).toStrictEqual(expected);

  const expectedItems = [...expected[0], ...expected[1]];

  expect(
    [...actual[0], ...actual[1]].every((value, index) =>
      Object.is(value, expectedItems[index]),
    ),
  ).toBe(true);
}

// A list, so that a call that returns compares too, as an empty one.
function thrownBy(run: () => unknown): readonly unknown[] {
  try {
    run();
    return [];
  } catch (error) {
    return [error];
  }
}
