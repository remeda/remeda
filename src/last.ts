import { NonEmptyArray } from './_types';
import { purry } from './purry';

/**
 * Gets the last element of `array`.
 * Note: In `pipe`, use `last()` form instead of `last`. Otherwise, the inferred type is lost.
 * @param array the array
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 *
 * @category Array
 * @pipeable
 */
export function last<T>(array: NonEmptyArray<T>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;
export function last() {
  return purry(_last, arguments);
}

function _last<T>(array: T[]) {
  return array[array.length - 1];
}
