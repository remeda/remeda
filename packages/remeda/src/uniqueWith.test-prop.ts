import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { uniqueWith } from "./uniqueWith";

// Few distinct values, so duplicates are common, among them the ones equality
// treats specially: `NaN`, `-0` next to `0`, and two objects of the same shape
// that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// A generated comparator is neither symmetric nor transitive, so the result
// depends on exactly which pairs are compared.
test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, isEquals) => {
    const dataFirst = uniqueWith(data, isEquals);
    const dataLast = pipe(data, uniqueWith(isEquals));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataFirst).toHaveLength(dataLast.length);
    expect(
      dataFirst.every((value, index) => Object.is(value, dataLast[index])),
    ).toBe(true);
  },
);
