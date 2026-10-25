import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { findLast } from "./findLast";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, so a pure predicate gives repeated items the same
// answer, among them `NaN`, `-0` next to `0`, and two objects of the same
// shape that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

const count = fc.integer({ min: -1, max: 32 });

test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, predicateOf) => {
    // Pure in the item and its index, and ignoring `data`, so the answers
    // don't depend on which items the predicate runs on, or in what order:
    // data-first scans backward and stops at the first match.
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    const dataFirst = findLast(data, predicate);

    // By identity: deep equality can't tell the two objects apart.
    expect(pipe(data, findLast(predicate))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), findLast(predicate))).toBe(dataFirst);
  },
);

test.prop([items, fc.func(fc.boolean()), count])(
  "taking a prefix in the pipe finds like data-first on the prefix",
  (data, predicateOf, prefixLength) => {
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    expect(pipe(data, take(prefixLength), findLast(predicate))).toBe(
      findLast(take(data, prefixLength), predicate),
    );
  },
);
