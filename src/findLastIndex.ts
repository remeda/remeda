import { purry } from './purry';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 * @param array the array
 * @param fn the predicate
 * @signature
 *    R.findLastIndex(items, fn)
 *    R.findLastIndex.indexed(items, fn)
 * @example
 *    R.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 *    R.findLastIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 1
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLastIndex<T>(
  array: readonly T[],
  fn: Pred<T, boolean>
): number;

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 * @param array the array
 * @param fn the predicate
 * @signature
 *    R.findLastIndex(fn)(items)
 *    R.findLastIndex.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLastIndex.indexed((n, i) => n % 2 === 1)
 *    ) // => 1
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLastIndex<T>(
  fn: Pred<T, boolean>
): (array: readonly T[]) => number;

export function findLastIndex() {
  return purry(_findLastIndex(false), arguments);
}

const _findLastIndex = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, boolean>
) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (indexed ? fn(array[i], i, array) : fn(array[i])) {
      return i;
    }
  }

  return -1;
};

export namespace findLastIndex {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, boolean>
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: readonly T[]) => number;

  export function indexed() {
    return purry(_findLastIndex(true), arguments);
  }
}
