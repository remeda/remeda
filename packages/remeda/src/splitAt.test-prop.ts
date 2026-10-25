import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { splitAt } from "./splitAt";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Whole, fractional, negative and out of range indices, and the ones that
// `Math` treats specially.
const index = fc.oneof(
  fc.integer({ min: -12, max: 12 }),
  fc.double({ min: -12, max: 12, noNaN: true }),
  fc.constantFrom(NaN, -0, Infinity, -Infinity),
);

const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

// Dense arrays only: in `pipe`, `take` reads a hole as `undefined`, while
// data-first `splitAt` slices and keeps it.
test.prop([fc.array(item), index])(
  "data-first and data-last produce the same result",
  (data, splitIndex) => {
    const dataFirst = splitAt(data, splitIndex);

    expectSameSplit(pipe(data, splitAt(splitIndex)), dataFirst);
    expectSameSplit(pipe(data, take(Infinity), splitAt(splitIndex)), dataFirst);
  },
);

test.prop([fc.sparseArray(item), index])(
  "data-last keeps the holes data-first keeps",
  (data, splitIndex) => {
    expectSameSplit(pipe(data, splitAt(splitIndex)), splitAt(data, splitIndex));
  },
);

test.prop([fc.array(item), index, count])(
  "data-last after `take` splits the taken prefix",
  (data, splitIndex, takeCount) => {
    expectSameSplit(
      pipe(data, take(takeCount), splitAt(splitIndex)),
      splitAt(take(data, takeCount), splitIndex),
    );
  },
);

type Split = readonly [readonly unknown[], readonly unknown[]];

// Deep equality can't tell the two objects of the same shape apart.
function expectSameSplit(actual: Split, expected: Split): void {
  expect(actual).toStrictEqual(expected);

  const expectedItems = [...expected[0], ...expected[1]];

  expect(
    [...actual[0], ...actual[1]].every((value, itemIndex) =>
      Object.is(value, expectedItems[itemIndex]),
    ),
  ).toBe(true);
}
