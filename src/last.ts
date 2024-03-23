import type { NonEmptyArray } from "./_types";
import { purry } from "./purry";

/**
 * Gets the last element of `array`.
 *
 * @param array - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @pipeable
 * @category Array
 * @similarTo lodash last
 * @similarTo ramda last
 */
export function last<T>(array: Readonly<NonEmptyArray<T>>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @pipeable
 * @category Array
 * @similarTo lodash last
 * @similarTo ramda last
 */
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;

export function last(): unknown {
  return purry(_last, arguments);
}

function _last<T>(array: ReadonlyArray<T>): T | undefined {
  return array[array.length - 1];
}
