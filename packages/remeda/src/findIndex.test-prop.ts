import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { findIndex } from "./findIndex";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, so the predicate often answers the same for several
// items, among them the ones equality treats specially: `NaN`, `-0` next to
// `0`, and two objects of the same shape that only their reference tells
// apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole counts only: in `pipe`, `take` rounds a fractional count up and keeps
// everything for `NaN`, while data-first `take` slices.
const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 12 }),
  fc.constant(Infinity),
);

test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, predicateOf) => {
    // The predicate ignores `data`, which a lazy step in `pipe` fills only
    // with the items so far, while data-first gets the whole input.
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    const dataFirst = findIndex(data, predicate);

    expect(pipe(data, findIndex(predicate))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), findIndex(predicate))).toBe(dataFirst);
  },
);

test.prop([items, takeCount, fc.func(fc.boolean())])(
  "a preceding take matches searching the taken items",
  (data, count, predicateOf) => {
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    expect(pipe(data, take(count), findIndex(predicate))).toBe(
      findIndex(take(data, count), predicate),
    );
  },
);
