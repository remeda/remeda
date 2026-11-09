import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { pipe } from "./pipe";
import { unique } from "./unique";

test.prop([
  fc.array(
    // Few distinct values, so duplicates are common, among them the ones
    // equality treats specially: `NaN`, `-0` next to `0`, and two objects of
    // the same shape that only their reference tells apart.
    fc.oneof(
      fc.integer({ min: 0, max: 3 }),
      fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
    ),
  ),
])("data-first and data-last produce the same result", (data) => {
  const dataFirst = unique(data);
  const dataLast = pipe(data, forceFusion(), unique());

  // By identity: deep equality can't tell the two objects apart.
  expect(dataFirst).toHaveLength(dataLast.length);
  expect(
    dataFirst.every((value, index) => Object.is(value, dataLast[index])),
  ).toBe(true);
});
