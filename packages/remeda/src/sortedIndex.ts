import { purry } from "./purry";
import { binarySearchCutoffIndex } from "./internal/binarySearchCutoffIndex";

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..array.length).
 * @signature
 *    sortedIndex(data, item)
 * @example
 *    sortedIndex(['a','a','b','c','c'], 'c') // => 3
 * @dataFirst
 * @category Array
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndex<T>(data: readonly T[], item: T): number;

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..array.length).
 * @signature
 *    sortedIndex(item)(data)
 * @example
 *    pipe(['a','a','b','c','c'], sortedIndex('c')) // => 3
 * @dataLast
 * @category Array
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndex<T = never>(
  // We first try to infer T through the callback to allow the type to be pulled
  // from the call site it is used in (like `pipe`).
  item: NoInfer<T>,
): (data: readonly T[]) => number;

export function sortedIndex<T>(
  // Otherwise we allow T to be inferred directly from the operand.
  item: T,
): (data: readonly NoInfer<T>[]) => number;

export function sortedIndex(...args: readonly unknown[]): unknown {
  return purry(sortedIndexImplementation, args);
}

const sortedIndexImplementation = <T>(array: readonly T[], item: T): number =>
  binarySearchCutoffIndex(array, (pivot) => pivot < item);
