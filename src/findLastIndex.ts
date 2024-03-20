import { purry } from "./purry";
import type { Pred, PredIndexedOptional, PredIndexed } from "./_types";

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.findLastIndex(items, fn)
 *    R.findLastIndex.indexed(items, fn)
 * @example
 *    R.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 *    R.findLastIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 1
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 * @similarTo lodash findLastIndex
 * @similarTo ramda findLastIndex
 */
export function findLastIndex<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>,
): number;

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param fn - The predicate.
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
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 * @similarTo lodash findLastIndex
 * @similarTo ramda findLastIndex
 */
export function findLastIndex<T>(
  fn: Pred<T, boolean>,
): (array: ReadonlyArray<T>) => number;

export function findLastIndex(): unknown {
  return purry(_findLastIndex(false), arguments);
}

const _findLastIndex =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (indexed ? fn(array[i]!, i, array) : fn(array[i]!)) {
        return i;
      }
    }

    return -1;
  };

export namespace findLastIndex {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(): unknown {
    return purry(_findLastIndex(true), arguments);
  }
}
