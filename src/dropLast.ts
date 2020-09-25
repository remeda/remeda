import { purry } from './purry';

/**
 * Removes last `n` elements from the `array`.
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *    R.dropLast(array, n)
 * @example
 *    R.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @data_first
 * @category Array
 */
export function dropLast<T>(array: readonly T[], n: number): T[];

/**
 * Removes last `n` elements from the `array`.
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *    R.dropLast(n)(array)
 * @example
 *    R.dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @data_last
 * @category Array
 */
export function dropLast<T>(n: number): (array: readonly T[]) => T[];

export function dropLast() {
  return purry(_dropLast, arguments);
}

function _dropLast<T>(array: T[], n: number) {
  const copy = [...array];
  if (n !== 0) {
    copy.splice(-n);
  }
  return copy;
}
