/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- ignore for deprecated files */

import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a list of elements that exist in both array.
 *
 * ! **DEPRECATED**: Use `R.filter(array, R.isIncludedIn(other))`. Will be removed in v2!
 *
 * @param array - The source array.
 * @param other - The second array.
 * @signature
 *    R.intersection(array, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]) // => [2, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.filter(array, R.isIncludedIn(other))`. Will be removed in v2.
 */
export function intersection<T>(
  source: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Returns a list of elements that exist in both array.
 *
 * ! **DEPRECATED**: Use `R.filter(R.isIncludedIn(other))`. Will be removed in v2!
 *
 * @param array - The source array.
 * @param other - The second array.
 * @signature
 *    R.intersection(other)(array)
 * @example
 *    R.intersection([2, 3, 5])([1, 2, 3]) // => [2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 * @deprecated Use `R.filter(R.isIncludedIn(other))`. Will be removed in v2.
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
