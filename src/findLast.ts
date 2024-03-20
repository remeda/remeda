import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import { purry } from "./purry";

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.findLast(items, fn)
 *    R.findLast.indexed(items, fn)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 *    R.findLast.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 3
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 * @mapping lodash findLast
 * @mapping ramda findLast
 */
export function findLast<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>,
): T | undefined;

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 *
 * @param fn - The predicate.
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
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 * @mapping lodash findLast
 * @mapping ramda findLast
 */
export function findLast<T = never>(
  fn: Pred<T, boolean>,
): (array: ReadonlyArray<T>) => T | undefined;

export function findLast(): unknown {
  return purry(_findLast(false), arguments);
}

const _findLast =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (indexed ? fn(array[i]!, i, array) : fn(array[i]!)) {
        return array[i];
      }
    }
    return;
  };

export namespace findLast {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => T | undefined;

  export function indexed(): unknown {
    return purry(_findLast(true), arguments);
  }
}
