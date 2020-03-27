import { purry } from './purry';

/**
 * Combines two arrays.
 * @param arr1 the first array
 * @param arr2 the second array
 * @signature
 *    R.concat(arr1, arr2);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @data_first
 * @category Array
 */
export function concat<T, K>(
  arr1: readonly T[],
  arr2: readonly K[]
): Array<T | K>;

/**
 * Combines two arrays.
 * @param arr2 the second array
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @data_last
 * @category Array
 */
export function concat<T, K>(
  arr2: readonly K[]
): (arr1: readonly T[]) => Array<T | K>;

export function concat() {
  return purry(_concat, arguments);
}

function _concat(arr1: any[], arr2: any[]) {
  return arr1.concat(arr2);
}
