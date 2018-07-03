import { purry } from './purry';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param items The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.filter(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @data_first
 */
export function filter<T>(items: T[], fn: (input: T) => boolean): T[];

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param fn the callback function.
 * @signature
 *    R.filter(fn)(array)
 * @example
 *    R.filter(x => x % 2 === 1)([1, 2, 3]) // => [1, 3]
 * @data_last
 */
export function filter<T>(fn: (input: T) => boolean): (items: T[]) => T[];

export function filter() {
  return purry(_filter, arguments);
}

function _filter<T>(items: T[], fn: (input: T) => boolean) {
  return items.filter(item => fn(item));
}
