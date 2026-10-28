import { purry } from "./purry";
import { binarySearchCutoffIndex } from "./internal/binarySearchCutoffIndex";

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    sortedLastIndex(data, item)
 * @example
 *    sortedLastIndex(['a','a','b','c','c'], 'c') // => 5
 * @dataFirst
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
export function sortedLastIndex<T>(data: readonly T[], item: T): number;

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    sortedLastIndex(item)(data)
 * @example
 *    pipe(['a','a','b','c','c'], sortedLastIndex('c')) // => 5
 * @dataLast
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
export function sortedLastIndex<T = never>(
  // `T` is inferred from the data so that a literal item (`"active"`) doesn't
  // narrow it below the data's items (`Status`). With no data to infer from,
  // the `never` default rejects the item so the overload below takes the call.
  item: NoInfer<T>,
): (data: readonly T[]) => number;
export function sortedLastIndex<T>(
  // An item wider than the data's items (`"c"` for `("a" | "b")[]`) doesn't
  // match the overload above, so `T` is inferred from the item instead.
  item: T,
): (data: readonly NoInfer<T>[]) => number;

export function sortedLastIndex(...args: readonly unknown[]): unknown {
  return purry(sortedLastIndexImplementation, args);
}

const sortedLastIndexImplementation = <T>(
  array: readonly T[],
  item: T,
): number =>
  binarySearchCutoffIndex(
    array,
    // The only difference between the regular implementation and the "last"
    // variation is that we consider the pivot with equality too, so that we
    // skip all equal values in addition to the lower ones.
    (pivot) => pivot <= item,
  );
