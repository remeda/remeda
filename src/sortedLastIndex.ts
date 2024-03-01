import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";

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
 * @return - Insertion index (In the range 0..data.length)
 *
 * @signature
 *    R.sortedLastIndex(data, item)
 * @example
 *    R.sortedLastIndex(['a','a','b','c','c'], 'c') // => 5
 * @dataFirst
 * @category Array
 *
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
export function sortedLastIndex<T>(data: ReadonlyArray<T>, item: T): number;

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
 * @return - Insertion index (In the range 0..data.length)
 *
 * @signature
 *    R.sortedLastIndex(item)(data)
 * @example
 *    R.pipe(['a','a','b','c','c'], sortedLastIndex('c')) // => 5
 * @dataLast
 * @category Array
 *
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
export function sortedLastIndex<T>(item: T): (data: ReadonlyArray<T>) => number;

export function sortedLastIndex(): unknown {
  return purry(sortedLastIndexImplementation, arguments);
}

const sortedLastIndexImplementation = <T>(
  array: ReadonlyArray<T>,
  item: T,
): number =>
  _binarySearchCutoffIndex(
    array,
    // The only difference between the regular implementation and the "last"
    // variation is that we consider the pivot with equality too, so that we
    // skip all equal values in addition to the lower ones.
    (pivot) => pivot <= item,
  );
