import { NonEmptyArray } from "./_types";
import { purry } from "./purry";

/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @category Array
 * @pipeable
 * @dataFirst
 */
export function last<T>(array: NonEmptyArray<T>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;

/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @category Array
 * @pipeable
 * @dataLast
 */
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;

export function last() {
  return purry(_last, arguments);
}

function _last<T>(array: Array<T>) {
  return array[array.length - 1];
}
