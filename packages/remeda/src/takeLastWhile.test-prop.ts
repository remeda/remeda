import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { take } from "./take";
import { takeLastWhile } from "./takeLastWhile";

// Few distinct values, so a pure predicate gives repeated items the same
// answer, among them `NaN`, `-0` next to `0`, and two objects of the same
// shape that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Dense only: `slice` keeps a hole, while a lazy step reads it as
// `undefined`.
const items = fc.array(item);

const count = fc.integer({ min: -1, max: 12 });

test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, predicateOf) => {
    // Pure in the item and its index, and ignoring `data`, so the answers
    // don't depend on which items the predicate runs on, or in what order:
    // data-first scans backward and stops at the first failure.
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    const dataFirst = takeLastWhile(data, predicate);
    const dataLast = pipe(data, takeLastWhile(predicate));
    const afterTake = pipe(data, take(Infinity), takeLastWhile(predicate));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataLast).toHaveLength(dataFirst.length);
    expect(
      dataLast.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
    expect(afterTake).toHaveLength(dataFirst.length);
    expect(
      afterTake.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
  },
);

test.prop([items, fc.func(fc.boolean()), count])(
  "taking a prefix in the pipe takes like data-first on the prefix",
  (data, predicateOf, prefixLength) => {
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    const onPrefix = takeLastWhile(take(data, prefixLength), predicate);
    const dataLast = pipe(data, take(prefixLength), takeLastWhile(predicate));

    expect(dataLast).toHaveLength(onPrefix.length);
    expect(
      dataLast.every((value, index) => Object.is(value, onPrefix[index])),
    ).toBe(true);
  },
);
