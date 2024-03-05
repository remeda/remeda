import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a list of elements that exist in both array.
 * @param array the source array
 * @param other the second array
 * @signature
 *    R.intersection(array, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]) // => [2, 3]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function intersection<T>(
  source: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Returns a list of elements that exist in both array.
 * @param array the source array
 * @param other the second array
 * @signature
 *    R.intersection(other)(array)
 * @example
 *    R.intersection([2, 3, 5])([1, 2, 3]) // => [2, 3]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function intersection<T, K>(
  other: ReadonlyArray<T>,
): (source: ReadonlyArray<K>) => Array<T>;

export function intersection(): unknown {
  return purry(_intersection, arguments, intersection.lazy);
}

function _intersection<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> {
  const lazy = intersection.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace intersection {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    const set = new Set(other);
    return (value) =>
      set.has(value)
        ? { done: false, hasNext: true, next: value }
        : { done: false, hasNext: false };
  }
}
