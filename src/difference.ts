import { purry } from './purry';

/**
 * Excludes the values from `other` array.
 * @param array the source array
 * @param other the values to exclude
 * @signature
 *    R.difference(array, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]) // => [1, 4]
 * @data_first
 * @category Array
 */
export function difference<T>(array: T[], other: T[]): T[];

/**
 * Excludes the values from `other` array.
 * @param other the values to exclude
 * @signature
 *    R.difference(other)(array)
 * @example
 *    R.difference([2, 5, 3])([1, 2, 3, 4]) // => [1, 4]
 * @data_last
 * @category Array
 */
export function difference<T>(other: T[]): (array: T[]) => T[];

export function difference() {
  return purry(_difference, arguments);
}

function _difference<T>(array: T[], other: T[]) {
  const set = new Set(other);
  return array.filter(x => !set.has(x));
}
