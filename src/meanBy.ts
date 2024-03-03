import { purry } from "./purry";
import type { PredIndexed, PredIndexedOptional } from "./_types";

const _meanBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    if (array.length === 0) {
      return NaN;
    }

    let sum = 0;
    array.forEach((item, i) => {
      sum += indexed ? fn(item, i, array) : fn(item);
    });

    return sum / array.length;
  };

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param fn predicate function
 * @signature
 *   R.meanBy(fn)(array)
 *   R.meanBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  fn: (item: T) => number,
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param items the array
 * @param fn predicate function
 * @signature
 *   R.meanBy(array, fn)
 *   R.meanBy.indexed(array, fn)
 * @example
 *    R.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number,
): number;

export function meanBy() {
  return purry(_meanBy(false), arguments);
}

export namespace meanBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>,
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>,
  ): (array: ReadonlyArray<T>) => number;

  export function indexed() {
    return purry(_meanBy(true), arguments);
  }
}
