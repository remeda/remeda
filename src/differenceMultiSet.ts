import { createLazyDifferenceMultiSetByEvaluator } from './_createLazyDifferenceMultiSetByEvaluator';
import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the difference of two arrays using *multi-set* (or "bag") semantics.
 *
 * Unlike the set-based `difference` function that remove *all* items from
 * `other`, this function keeps track of the number of copies of each item and
 * only removes the subtracted copies.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The array from which elements are subtracted.
 * @param other - The array whose elements will be subtracted.
 * @signature
 *    R.differenceMultiSet(data, other)
 * @example
 *    R.differenceMultiSet([1,2,2,3], [2]);  // => [1, 2, 3]
 *    R.differenceMultiSet([1,2,2,3], [2,2]);  // => [1, 3]
 *    R.differenceMultiSet([3,1,2,2], [2]);  // => [3, 1, 2]
 * @data_first
 * @category Array
 * @pipeable
 */
export function differenceMultiSet<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): Array<T>;

/**
 * Computes the difference of two arrays using *multi-set* (or "bag") semantics.
 *
 * Unlike the set-based `difference` function that remove *all* items from
 * `other`, this function keeps track of the number of copies of each item and
 * only removes the subtracted copies.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The array from which elements are subtracted.
 * @param other - The array whose elements will be subtracted.
 * @signature
 *    R.differenceMultiSet(other)(data)
 * @example
 *    R.pipe([1,2,2,3], R.differenceMultiSet([2]));  // => [1, 2, 3]
 *    R.pipe([1,2,2,3], R.differenceMultiSet([2,2]));  // => [1, 3]
 *    R.pipe([3,1,2,2], R.differenceMultiSet([2]));  // => [3, 1, 2]
 * @data_last
 * @category Array
 * @pipeable
 */
export function differenceMultiSet<T>(
  other: ReadonlyArray<T>
): (data: ReadonlyArray<T>) => Array<T>;

export function differenceMultiSet() {
  return purry(
    differenceMultiSetImplementation,
    arguments,
    differenceMultiSet.lazy
  );
}

const differenceMultiSetImplementation = <T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
) => _reduceLazy(data, createLazyDifferenceMultiSetByEvaluator(other));

export namespace differenceMultiSet {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    return createLazyDifferenceMultiSetByEvaluator(other);
  }
}
