import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Excludes the values from `other` array.
 * @param array the source array
 * @param other the values to exclude
 * @signature
 *    R.difference(array, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]) // => [1, 4]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function difference<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Excludes the values from `other` array.
 * @param other the values to exclude
 * @signature
 *    R.difference(other)(array)
 * @example
 *    R.difference([2, 5, 3])([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 3, 4, 5, 6], // only 4 iterations
 *      R.difference([2, 3]),
 *      R.take(2)
 *    ) // => [1, 4]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function difference<T, K>(
  other: ReadonlyArray<T>,
): (array: ReadonlyArray<K>) => Array<T>;

export function difference(): unknown {
  return purry(_difference, arguments, difference.lazy);
}

function _difference<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> {
  const lazy = difference.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace difference {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    const set = new Set(other);
    return (value) =>
      set.has(value)
        ? { done: false, hasNext: false }
        : { done: false, hasNext: true, next: value };
  }
}
