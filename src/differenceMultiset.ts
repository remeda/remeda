import { createLazyDifferenceMultisetByEvaluator } from './_createLazyDifferenceMultisetByEvaluator';
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
 *    R.differenceMultiset(data, other)
 * @example
 *    R.differenceMultiset([1,2,2,3], [2]);  // => [1, 2, 3]
 *    R.differenceMultiset([1,2,2,3], [2,2]);  // => [1, 3]
 *    R.differenceMultiset([3,1,2,2], [2]);  // => [3, 1, 2]
 * @data_first
 * @category Array
 * @pipeable
 */
export function differenceMultiset<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): Array<TData>;

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
 *    R.differenceMultiset(other)(data)
 * @example
 *    R.pipe([1,2,2,3], R.differenceMultiset([2]));  // => [1, 2, 3]
 *    R.pipe([1,2,2,3], R.differenceMultiset([2,2]));  // => [1, 3]
 *    R.pipe([3,1,2,2], R.differenceMultiset([2]));  // => [3, 1, 2]
 * @data_last
 * @category Array
 * @pipeable
 */
export function differenceMultiset<TData, TOther = TData>(
  other: ReadonlyArray<TOther>
): (data: ReadonlyArray<TData>) => Array<TData>;

export function differenceMultiset() {
  return purry(
    differenceMultisetImplementation,
    arguments,
    differenceMultiset.lazy
  );
}

const differenceMultisetImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
) => _reduceLazy(data, createLazyDifferenceMultisetByEvaluator(other));

export namespace differenceMultiset {
  export function lazy<TData, TOther = TData>(
    other: ReadonlyArray<TOther>
  ): LazyEvaluator<TData> {
    return createLazyDifferenceMultisetByEvaluator(other);
  }
}
