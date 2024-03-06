import { purry } from "./purry";

type Enumerable<T> = ArrayLike<T> | Iterable<T>;

/**
 * Counts values of the collection or iterable.
 * @param items - The input data.
 * @signature
 *    R.length(array)
 * @example
 *    R.length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
export function length<T>(items: Enumerable<T>): number;

/**
 * Counts values of the collection or iterable.
 * @param items - The input data.
 * @signature
 *    R.length()(array)
 * @example
 *    R.pipe([1, 2, 3], R.length()) // => 3
 * @dataLast
 * @category Array
 */
export function length<T>(): (items: Enumerable<T>) => number;

/**
 * Counts values of the collection or iterable.
 * @signature
 *    R.length()(array)
 * @example
 *    R.pipe([1, 2, 3], R.length()) // => 3
 * @category Array
 */
export function length(): unknown {
  return purry(_length, arguments);
}

function _length<T>(items: Enumerable<T>): number {
  return "length" in items ? items.length : Array.from(items).length;
}
