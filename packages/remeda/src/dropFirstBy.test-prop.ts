import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { dropFirstBy } from "./dropFirstBy";

// Few distinct values so duplicates are common, among them the two that the
// heap's "nothing was inserted" signal must not be confused with.
const item = fc.constantFrom(null, undefined, -2, -1, 0, 1, 2);

// A hole reads as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

test.prop([items, fc.integer({ min: -2, max: 12 })])(
  "drops the n smallest items, like a sort-based reference",
  (data, n) => {
    // The result is in eviction order, so it is sorted before the comparison.
    expect(sortedByRank(dropFirstBy(data, n, rank))).toStrictEqual(
      sortedByRank(data).slice(Math.min(Math.max(n, 0), data.length)),
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
