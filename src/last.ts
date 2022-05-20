import { NonEmptyArray } from './_types';

/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @category Array
 */
export function last<T>(array: NonEmptyArray<T>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;
export function last(array: ReadonlyArray<unknown> | NonEmptyArray<unknown>) {
  return array[array.length - 1];
}
