import { flatten } from './flatten';
import { purry } from './purry';

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    R.flatMap(array, fn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @data_first
 * @category Array
 */
export function flatMap<T, K>(array: T[], fn: (input: T) => K | K[]): K[];

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    R.flatMap(fn)(array)
 * @example
 *    R.flatMap(x => [x, x * 10])([1, 2, 3]) // => [1, 10, 2, 20, 3, 30]
 * @data_last
 * @category Array
 */
export function flatMap<T, K>(fn: (input: T) => K | K[]): (array: T[]) => K[];

export function flatMap() {
  return purry(_flatMap, arguments);
}

function _flatMap<T, K>(array: T[], fn: (input: T) => K[]): K[] {
  return flatten(array.map(item => fn(item)));
}
