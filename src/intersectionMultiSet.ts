import { createLazyIntersectionMultiSetByEvaluator } from './_createLazyIntersectionMultiSetByEvaluator';
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
 *    R.intersectionMultiSet(data, other)
 * @example
 *    R.intersectionMultiSet([1,2],[2,3]);  // => [2]
 *    R.intersectionMultiSet([1,2,2],[2,3]);  // => [2]
 *    R.intersectionMultiSet([1,1,1,2],[1,1,3]);  // => [1,1]
 *    R.intersectionMultiSet([3,2,1],[2,3]);  // => [3,2]
 * @data_first
 * @category Array
 * @pipeable
 */
export function intersectionMultiSet<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): Array<T>;

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
 *    R.intersectionMultiSet(other)(data)
 * @example
 *    R.pipe([1,2], R.intersectionMultiSet([2,3]));  // => [2]
 *    R.pipe([1,2,2], R.intersectionMultiSet([2,3]));  // => [2]
 *    R.pipe([1,1,1,2], R.intersectionMultiSet([1,1,3]));  // => [1,1]
 *    R.pipe([3,2,1], R.intersectionMultiSet([2,3]));  // => [3,2]
 * @data_last
 * @category Array
 * @pipeable
 */
export function intersectionMultiSet<T>(
  other: ReadonlyArray<T>
): (data: ReadonlyArray<T>) => Array<T>;

export function intersectionMultiSet() {
  return purry(
    intersectionMultiSetImplementation,
    arguments,
    intersectionMultiSet.lazy
  );
}

const intersectionMultiSetImplementation = <T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): Array<T> =>
  _reduceLazy(data, createLazyIntersectionMultiSetByEvaluator(other));

export namespace intersectionMultiSet {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    return createLazyIntersectionMultiSetByEvaluator(other);
  }
}
