import { purry } from './purry';

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.findIndex(items, fn)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @data_first
 * @category Array
 */
export function findIndex<T>(array: T[], fn: (item: T) => boolean): number;

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.findIndex(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ) // => 4
 * @data_last
 * @category Array
 */
export function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;

export function findIndex() {
  return purry(_findIndex, arguments);
}

function _findIndex<T>(array: T[], fn: (item: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i;
    }
  }
  return -1;
}
