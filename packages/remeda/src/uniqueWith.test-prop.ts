import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { pipe } from "./pipe";
import { uniqueWith } from "./uniqueWith";

const ITEMS = fc.array(
  // Few distinct values, so duplicates are common, among them the ones
  // equality treats specially: `NaN`, `-0` next to `0`, and two objects of the
  // same shape that only their reference tells apart.
  fc.oneof(
    fc.integer({ min: 0, max: 3 }),
    fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
  ),
);

const COMPARATOR = fc.func(
  // Arbitrary answers make the comparator neither symmetric nor transitive, so
  // the result depends on exactly which pairs are compared.
  fc.boolean(),
);

test.prop([ITEMS, COMPARATOR])(
  "data-first and data-last produce the same result",
  (data, isEquals) => {
    const dataFirst = uniqueWith(data, isEquals);
    const dataLast = pipe(data, forceFusion(), uniqueWith(isEquals));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataFirst).toHaveLength(dataLast.length);
    expect(
      dataFirst.every((value, index) => Object.is(value, dataLast[index])),
    ).toBe(true);
  },
);

test.prop([ITEMS, COMPARATOR])(
  "data-first and data-last before a step that can stop early produce the same result",
  (data, isEquals) => {
    const dataFirst = uniqueWith(data, isEquals);
    // Here `data` also holds the items after the current one, which the
    // evaluator must ignore.
    const dataLast = pipe(data, uniqueWith(isEquals), forceFusion());

    // By identity: deep equality can't tell the two objects apart.
    expect(dataFirst).toHaveLength(dataLast.length);
    expect(
      dataFirst.every((value, index) => Object.is(value, dataLast[index])),
    ).toBe(true);
  },
);
