import { createLazyIntersectionMultisetByEvaluator } from './_createLazyIntersectionMultisetByEvaluator';
import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the intersection of two arrays using *multi-set* (or "bag")
 * semantics.
 *
 * Unlike the set-based `intersection` function that adds *all* items that have
 * a matching item in `other`, this function keeps track of the number of copies
 * of each item and only adds matching *copies*.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The base array.
 * @param other - The array that items would be compared against.
 * @signature
 *    R.intersectionMutlisetBy(data, other)
 * @example
 *    R.intersectionMutlisetBy([1,2],[2,3]);  // => [2]
 *    R.intersectionMutlisetBy([1,2,2],[2,3]);  // => [2]
 *    R.intersectionMutlisetBy([1,1,1,2],[1,1,3]);  // => [1,1]
 *    R.intersectionMutlisetBy([3,2,1],[2,3]);  // => [3,2]
 * @data_first
 * @category Array
 * @pipeable
 */
export function intersectionMutliset<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): Array<TData>;

/**
 * Computes the intersection of two arrays using *multi-set* (or "bag")
 * semantics.
 *
 * Unlike the set-based `intersection` function that adds *all* items that have
 * a matching item in `other`, this function keeps track of the number of copies
 * of each item and only adds matching *copies*.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The base array.
 * @param other - The array that items would be compared against.
 * @signature
 *    R.intersectionMutlisetBy(other)(data)
 * @example
 *    R.pipe([1,2], R.intersectionMutlisetBy([2,3]));  // => [2]
 *    R.pipe([1,2,2], R.intersectionMutlisetBy([2,3]));  // => [2]
 *    R.pipe([1,1,1,2], R.intersectionMutlisetBy([1,1,3]));  // => [1,1]
 *    R.pipe([3,2,1], R.intersectionMutlisetBy([2,3]));  // => [3,2]
 * @data_last
 * @category Array
 * @pipeable
 */
export function intersectionMutliset<TData, TOther = TData>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): (data: ReadonlyArray<TData>) => Array<TData & TOther>;

export function intersectionMutliset() {
  return purry(
    intersectionMutlisetImplementation,
    arguments,
    intersectionMutliset.lazy
  );
}

const intersectionMutlisetImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): Array<TData> =>
  _reduceLazy(data, createLazyIntersectionMultisetByEvaluator(other));

export namespace intersectionMutliset {
  export function lazy<TData, TOther = TData>(
    other: ReadonlyArray<TOther>
  ): LazyEvaluator<TData> {
    return createLazyIntersectionMultisetByEvaluator(other);
  }
}
