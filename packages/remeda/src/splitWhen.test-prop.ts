import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { splitWhen } from "./splitWhen";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

// Dense arrays only: in `pipe`, `take` reads a hole as `undefined`, while
// data-first `splitWhen` slices and keeps it once an item matches.
test.prop([fc.array(item), fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, isSplitPoint) => {
    // The predicate ignores `data`, which differs between the calling styles
    // on purpose: the whole input data-first, the items so far in `pipe`.
    const predicate = (value: unknown, index: number): boolean =>
      isSplitPoint(value, index);

    const dataFirst = splitWhen(data, predicate);

    expectSameSplit(pipe(data, splitWhen(predicate)), dataFirst);
    expectSameSplit(
      pipe(data, take(Infinity), splitWhen(predicate)),
      dataFirst,
    );
  },
);

test.prop([fc.sparseArray(item), fc.func(fc.boolean())])(
  "data-last keeps the holes data-first keeps",
  (data, isSplitPoint) => {
    const predicate = (value: unknown, index: number): boolean =>
      isSplitPoint(value, index);

    expectSameSplit(
      pipe(data, splitWhen(predicate)),
      splitWhen(data, predicate),
    );
  },
);

test.prop([fc.array(item), fc.func(fc.boolean()), count])(
  "data-last after `take` splits the taken prefix",
  (data, isSplitPoint, takeCount) => {
    const predicate = (value: unknown, index: number): boolean =>
      isSplitPoint(value, index);

    expectSameSplit(
      pipe(data, take(takeCount), splitWhen(predicate)),
      splitWhen(take(data, takeCount), predicate),
    );
  },
);

test.prop([
  fc.oneof(fc.array(item), fc.sparseArray(item)),
  fc.func(fc.boolean()),
  fc.func(fc.boolean()),
])(
  "data-last throws what data-first throws",
  (data, isSplitPoint, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const predicate = (value: unknown, index: number): boolean => {
      if (throwsAt(value, index)) {
        throw new RangeError(`Can't test the item at ${index}`);
      }

      return isSplitPoint(value, index);
    };

    const expected = thrownBy(() => splitWhen(data, predicate));

    expect(thrownBy(() => pipe(data, splitWhen(predicate)))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), splitWhen(predicate))),
    ).toStrictEqual(expected);
  },
);

type Split = readonly [readonly unknown[], readonly unknown[]];

// Deep equality can't tell the two objects of the same shape apart.
function expectSameSplit(actual: Split, expected: Split): void {
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
