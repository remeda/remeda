import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { uniqueBy } from "./uniqueBy";

// Few distinct values, so duplicates are common, among them the ones equality
// treats specially: `NaN`, `-0` next to `0`, and two objects of the same shape
// that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

test.prop([items, fc.func(fc.integer({ min: 0, max: 3 }))])(
  "data-first and data-last produce the same result",
  (data, keyOf) => {
    // The key ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const keyFunction = (value: unknown, index: number): number =>
      keyOf(value, index);

    const dataFirst = uniqueBy(data, keyFunction);
    const dataLast = pipe(data, uniqueBy(keyFunction));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataFirst).toHaveLength(dataLast.length);
    expect(
      dataFirst.every((value, index) => Object.is(value, dataLast[index])),
    ).toBe(true);
  },
);
