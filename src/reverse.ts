import { purry } from './purry';

/**
 * Reverses array.
 * @param array the array
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @data_first
 * @category Array
 */
export function reverse<T>(array: readonly T[]): Array<T>;

/**
 * Reverses array.
 * @param array the array
 * @signature
 *    R.reverse()(array);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @data_last
 * @category Array
 */
export function reverse<T>(): (array: readonly T[]) => Array<T>;

export function reverse() {
  return purry(_reverse, arguments);
}

function _reverse(array: any[]) {
  return array.slice().reverse();
}
