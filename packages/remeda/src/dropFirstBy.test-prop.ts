import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { dropFirstBy } from "./dropFirstBy";

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
