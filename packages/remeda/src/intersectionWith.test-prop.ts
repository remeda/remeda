import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { intersectionWith } from "./intersectionWith";
import { pipe } from "./pipe";

// Few distinct values, so duplicates within an input and overlaps between the
// inputs are common, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// A generated comparator is neither symmetric nor transitive, so the result
// depends on exactly which pairs are compared.
test.prop([items, items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, other, isEqual) => {
    const dataFirst = intersectionWith(data, other, isEqual);
    const dataLast = pipe(data, intersectionWith(other, isEqual));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataFirst).toHaveLength(dataLast.length);
    expect(
      dataFirst.every((value, index) => Object.is(value, dataLast[index])),
    ).toBe(true);
  },
);
