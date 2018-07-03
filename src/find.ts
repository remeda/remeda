import { purry } from './purry';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.find(items, fn)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @data_first
 * @category Array
 */
export function find<T>(array: T[], fn: (value: T) => boolean): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param fn the predicate
 * @signature
 *    R.find(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 * @data_last
 * @category Array
 */
export function find<T = never>(
  fn: (value: T) => boolean
): (array: T[]) => T | undefined;

export function find() {
  return purry(_find, arguments);
}

function _find<T>(array: T[], fn: (item: T) => any) {
  return array.find(x => fn(x));
}
