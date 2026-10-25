import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { concat } from "./concat";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`, in `data` and in `other`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 12 }),
  fc.constant(Infinity),
);

test.prop([items, items])(
  "data-first and data-last produce the same result",
  (data, other) => {
    const dataFirst = concat(data, other);

    expect(isSameItems(pipe(data, concat(other)), dataFirst)).toBe(true);
    expect(
      isSameItems(pipe(data, take(Infinity), concat(other)), dataFirst),
    ).toBe(true);
  },
);

test.prop([items, takeCount, items])(
  "a preceding take matches taking first",
  (data, count, other) => {
    expect(
      isSameItems(
        pipe(data, take(count), concat(other)),
        concat(take(data, count), other),
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
