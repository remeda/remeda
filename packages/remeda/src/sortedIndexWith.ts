import { binarySearchCutoffIndex } from "./internal/binarySearchCutoffIndex";
import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `true` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 * * `sortedIndex` - scans a sorted array with a binary search, find the first suitable index.
 * * `sortedIndexBy` - like `sortedIndex`, but assumes sorting is based on a callbackfn.
 * * `sortedLastIndex` - scans a sorted array with a binary search, finding the last suitable index.
 * * `sortedLastIndexBy` - like `sortedLastIndex`, but assumes sorting is based on a callbackfn.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param data - Array, "sorted" by `predicate`.
 * @param predicate - A predicate which also defines the array's order.
 * @returns Index (In the range 0..data.length).
 * @signature
 *    sortedIndexWith(data, predicate)
 * @example
 *    sortedIndexWith(['a','ab','abc'], (item) => item.length < 2) // => 1
 * @dataFirst
 * @category Array
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndexWith<T>(
  data: readonly T[],
  predicate: ArrayCallback<readonly T[], boolean>,
): number;

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `true` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 * * `sortedIndex` - scans a sorted array with a binary search, find the first suitable index.
 * * `sortedIndexBy` - like `sortedIndex`, but assumes sorting is based on a callbackfn.
 * * `sortedLastIndex` - scans a sorted array with a binary search, finding the last suitable index.
 * * `sortedLastIndexBy` - like `sortedLastIndex`, but assumes sorting is based on a callbackfn.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param predicate - A predicate which also defines the array's order.
 * @returns Index (In the range 0..data.length).
 * @signature
 *    sortedIndexWith(predicate)(data)
 * @example
 *    pipe(['a','ab','abc'], sortedIndexWith((item) => item.length < 2)) // => 1
 * @dataLast
 * @category Array
 */
export function sortedIndexWith<T>(
  predicate: ArrayCallback<readonly T[], boolean>,
): (data: readonly T[]) => number;

export function sortedIndexWith(
  dataOrPredicate:
    readonly unknown[] | ArrayCallback<readonly unknown[], boolean>,
  predicate?: ArrayCallback<readonly unknown[], boolean>,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLast(dataOrPredicate)
    : binarySearchCutoffIndex(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof binarySearchCutoffIndex> =
  (predicate) => (data) =>
    binarySearchCutoffIndex(data, predicate);
