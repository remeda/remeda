import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { splice } from "./splice";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`, in `data` and in the
// replacement.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole positions on both sides of the array, past either end; fractional
// ones (doubles also cover `NaN` and `-0`); and the infinities. Native
// `splice` truncates and clamps both `start` and `deleteCount`.
const position = fc.oneof(
  fc.integer({ min: -12, max: 12 }),
  fc.double({ min: -12, max: 12 }),
  fc.constantFrom(Infinity, -Infinity),
);

const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 12 }),
  fc.constant(Infinity),
);

test.prop([items, position, position, items])(
  "data-first and data-last produce the same result",
  // eslint-disable-next-line unicorn/no-non-function-verb-prefix -- `deleteCount` is the name native `splice` (and `splice` itself) gives this parameter.
  (data, start, deleteCount, replacement) => {
    const dataFirst = splice(data, start, deleteCount, replacement);

    expect(
      isSameItems(
        pipe(data, splice(start, deleteCount, replacement)),
        dataFirst,
      ),
    ).toBe(true);
    expect(
      isSameItems(
        pipe(data, take(Infinity), splice(start, deleteCount, replacement)),
        dataFirst,
      ),
    ).toBe(true);
  },
);

test.prop([items, takeCount, position, position, items])(
  "a preceding take matches taking first",
  // eslint-disable-next-line unicorn/no-non-function-verb-prefix -- `deleteCount` is the name native `splice` (and `splice` itself) gives this parameter.
  (data, count, start, deleteCount, replacement) => {
    expect(
      isSameItems(
        pipe(data, take(count), splice(start, deleteCount, replacement)),
        splice(take(data, count), start, deleteCount, replacement),
      ),
    ).toBe(true);
  },
);

// By identity, position by position: deep equality can't tell the two objects
// apart.
function isSameItems(
  actual: readonly unknown[],
  expected: readonly unknown[],
): boolean {
  return (
    actual.length === expected.length &&
    expected.every((value, index) => Object.is(value, actual[index]))
  );
}
