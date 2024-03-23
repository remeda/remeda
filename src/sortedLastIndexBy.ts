import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedLastIndex` - a simplified version of this function, without a callbackfn.
 * * `sortedIndexBy` - like this function, but returns the first suitable index.
 * * `sortedIndex` - like `sortedLastIndex` but without a callbackfn.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedLastIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataFirst
 * @category Array
 */
export function sortedLastIndexBy<T>(
  data: ReadonlyArray<T>,
  item: T,
  valueFunction: (
    item: T,
    index: number | undefined,
    data: ReadonlyArray<T>,
  ) => NonNullable<unknown>,
): number;

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedLastIndex` - a simplified version of this function, without a callbackfn.
 * * `sortedIndexBy` - like this function, but returns the first suitable index.
 * * `sortedIndex` - like `sortedLastIndex` but without a callbackfn.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndexBy(item, valueFunction)(data)
 * @example
 *    R.pipe([{age:20},{age:22}],sortedLastIndexBy({age:21},prop('age'))) // => 1
 * @dataLast
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndex
 */
export function sortedLastIndexBy<T>(
  item: T,
  valueFunction: (
    item: T,
    index: number | undefined,
    data: ReadonlyArray<T>,
  ) => NonNullable<unknown>,
): (data: ReadonlyArray<T>) => number;

export function sortedLastIndexBy(): unknown {
  return purry(sortedLastIndexByImplementation, arguments);
}

function sortedLastIndexByImplementation<T>(
  array: ReadonlyArray<T>,
  item: T,
  valueFunction: (
    item: T,
    index: number | undefined,
    data: ReadonlyArray<T>,
  ) => NonNullable<unknown>,
): number {
  const value = valueFunction(item, undefined /* index */, array);
  return _binarySearchCutoffIndex(
    array,
    // The only difference between the regular implementation and the "last"
    // variation is that we consider the pivot with equality too, so that we
    // skip all equal values in addition to the lower ones.
    (pivot, index) => valueFunction(pivot, index, array) <= value,
  );
}
