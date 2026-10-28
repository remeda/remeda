import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropFirstBy } from "./dropFirstBy";
import { pipe } from "./pipe";

// Few distinct values so ties are common, among them `null` and `undefined`,
// which must be dropped and kept like any other item.
const item = fc.constantFrom(null, undefined, -2, -1, 0, 1, 2);

// A hole reads as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Fractions, `NaN` and infinities too, which `dropFirstBy` truncates the way
// `slice` does.
const counts = fc.oneof(
  fc.integer({ min: -2, max: 12 }),
  fc.double({ min: -2, max: 12, noNaN: true }),
  fc.constantFrom(NaN, Infinity, -Infinity),
);

test.prop([items, counts])(
  "drops the n smallest items, like a sort-based reference",
  (data, n) => {
    // The result isn't in input order, so it is sorted before the comparison.
    expect(sortedByRank(dropFirstBy(data, n, rank))).toStrictEqual(
      sortedByRank(data).slice(Math.max(n, 0)),
    );
  },
);

// Fresh objects with few distinct keys, so ties are common and only the
// reference tells apart which of the tied items the heap dropped.
const keyedItem = fc.oneof(
  fc.record({ key: fc.integer({ min: 0, max: 2 }) }),
  fc.constantFrom(null, undefined),
);

// A hole reads as `undefined`.
const keyedItems = fc.oneof(fc.array(keyedItem), fc.sparseArray(keyedItem));

test.prop([keyedItems, counts])(
  "data-first and data-last produce the same result",
  (data, n) => {
    const dataFirst = dropFirstBy(data, n, keyOf);
    const dataLast = pipe(data, dropFirstBy(n, keyOf));

    expect(dataLast).toHaveLength(dataFirst.length);
    expect(
      dataLast.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
  },
);

test.prop([keyedItems, counts])(
  "data-first and a fused run produce the same result",
  (data, n) => {
    const dataFirst = dropFirstBy(data, n, keyOf);
    const fused = pipe(data, forceFusion(), dropFirstBy(n, keyOf));

    expect(fused).toHaveLength(dataFirst.length);
    expect(
      fused.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
  },
);

test.prop([keyedItems, counts])(
  "data-first and a fused run call the projection the same way",
  (data, n) => {
    const dataFirstCalls: unknown[] = [];
    dropFirstBy(data, n, (value) => {
      dataFirstCalls.push(value);
      return keyOf(value);
    });

    const fusedCalls: unknown[] = [];
    pipe(
      data,
      forceFusion(),
      dropFirstBy(n, (value) => {
        fusedCalls.push(value);
        return keyOf(value);
      }),
    );

    expect(fusedCalls).toHaveLength(dataFirstCalls.length);
    expect(
      fusedCalls.every((value, index) =>
        Object.is(value, dataFirstCalls[index]),
      ),
    ).toBe(true);
  },
);

// Ties nullish items with each other and with the objects in the middle key.
const keyOf = (value: { readonly key: number } | null | undefined): number =>
  value?.key ?? 1;

// Different for every distinct item, so equal ranks mean equal items and what
// is left is the same no matter which of the tied items the heap drops.
const rank = (value: number | null | undefined): number =>
  value === null ? 0.5 : (value ?? -0.5);

// The native sort moves `undefined` to the end without calling the comparator,
// so the items are wrapped to be ordered by their rank.
const sortedByRank = (
  data: readonly (number | null | undefined)[],
): (number | null | undefined)[] =>
  Array.from(data, (value) => ({ value, rank: rank(value) }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ value }) => value);
