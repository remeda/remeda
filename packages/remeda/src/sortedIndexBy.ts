/* eslint-disable @typescript-eslint/no-empty-object-type --
 * The value function can return anything other than `null` and `undefined`,
 * which is exactly what `{}` means.
 */

import { binarySearchCutoffIndex } from "./internal/binarySearchCutoffIndex";
import { purry3 } from "./internal/purryByArity";

type ValueFunction<T = unknown> = (
  item: T,
  index: number | undefined,
  data: readonly T[],
) => {};

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedIndex` - like this function, but doesn't take a callbackfn.
 * * `sortedLastIndexBy` - like this function, but finds the last suitable index.
 * * `sortedLastIndex` - like `sortedIndex`, but finds the last suitable index.
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
 *    sortedIndexBy(data, item, valueFunction)
 * @example
 *    sortedIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataFirst
 * @category Array
 */
export function sortedIndexBy<T>(
  data: readonly T[],
  item: T,
  valueFunction: ValueFunction<T>,
): number;

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedIndex` - like this function, but doesn't take a callbackfn.
 * * `sortedLastIndexBy` - like this function, but finds the last suitable index.
 * * `sortedLastIndex` - like `sortedIndex`, but finds the last suitable index.
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
 *    sortedIndexBy(item, valueFunction)(data)
 * @example
 *    pipe([{age:20},{age:22}],sortedIndexBy({age:21},prop('age'))) // => 1
 * @dataLast
 * @category Array
 */
export function sortedIndexBy<T = never>(
  // We first try to infer T through the callback to allow the type to be pulled
  // from the call site it is used in (like `pipe`).
  item: NoInfer<T>,
  valueFunction: ValueFunction<NoInfer<T>>,
): (data: readonly T[]) => number;

export function sortedIndexBy<T>(
  // Otherwise we allow T to be inferred directly from the operand.
  item: T,
  valueFunction: ValueFunction<NoInfer<T>>,
): (data: readonly NoInfer<T>[]) => number;

export function sortedIndexBy(
  dataOrItem: unknown,
  itemOrValueFunction?: unknown,
  valueFunction?: ValueFunction,
): unknown {
  return purry3(
    sortedIndexByImplementation,
    arguments.length,
    dataOrItem,
    itemOrValueFunction,
    valueFunction,
  );
}

function sortedIndexByImplementation<T>(
  data: readonly T[],
  item: T,
  valueFunction: (item: T, index: number | undefined, data: readonly T[]) => {},
): number {
  const value = valueFunction(item, undefined /* index */, data);
  return binarySearchCutoffIndex(
    data,
    (pivot, index) => valueFunction(pivot, index, data) < value,
  );
}
