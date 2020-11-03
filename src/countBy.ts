import { purry } from './purry';
import { Pred, PredIndexed, PredIndexedOptional } from './_types';

const _countBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, boolean>
) => {
  return array.reduce((ret, item, index) => {
    const value = indexed ? fn(item, index, array) : fn(item);
    return ret + (value ? 1 : 0);
  }, 0);
};

/**
 * Counts how many values of the collection pass the specified predicate.
 * @param items The input data.
 * @param fn The predicate.
 * @signature
 *    R.countBy(array, fn)
 * @example
 *    R.countBy([1, 2, 3, 4, 5], x => x % 2 === 0) // => 2
 * @data_first
 * @indexed
 * @category Array
 */
export function countBy<T>(items: readonly T[], fn: Pred<T, boolean>): number;

export function countBy<T>(
  fn: Pred<T, boolean>
): (array: readonly T[]) => number;

/**
 * Counts how many values of the collection pass the specified predicate.
 * @param fn The predicate.
 * @signature
 *    R.countBy(fn)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
 * @data_last
 * @indexed
 * @category Array
 */
export function countBy() {
  return purry(_countBy(false), arguments);
}

export namespace countBy {
  export function indexed<T, K>(
    array: readonly T[],
    fn: PredIndexed<T, boolean>
  ): number;
  export function indexed<T, K>(
    fn: PredIndexed<T, boolean>
  ): (array: readonly T[]) => number;
  export function indexed() {
    return purry(_countBy(true), arguments);
  }
}
