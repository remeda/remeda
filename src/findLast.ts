import { purry } from './purry';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 * @param array the array
 * @param fn the predicate
 * @signature
 *    R.findLast(items, fn)
 *    R.findLast.indexed(items, fn)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 *    R.findLast.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 3
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLast<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): T | undefined;

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 * @param fn the predicate
 * @signature
 *    R.findLast(fn)(items)
 *    R.findLast.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast(n => n % 2 === 1)
 *    ) // => 3
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast.indexed((n, i) => n % 2 === 1)
 *    ) // => 3
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLast<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function findLast() {
  return purry(_findLast(false), arguments);
}

const _findLast =
  (indexed: boolean) =>
  <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      // @ts-expect-error [ts2345] - This is safe, we are simply iterating over
      // indexes of the array
      if (indexed ? fn(array[i], i, array) : fn(array[i])) {
        return array[i];
      }
    }
    return undefined;
  };

export namespace findLast {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => T | undefined;

  export function indexed() {
    return purry(_findLast(true), arguments);
  }
}
