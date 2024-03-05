import { purry } from "./purry";
import type { PredIndexed, PredIndexedOptional } from "./_types";

const _minBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let ret: T | undefined;
    let retMin: number | undefined;
    array.forEach((item, i) => {
      const min = indexed ? fn(item, i, array) : fn(item);
      if (retMin === undefined || min < retMin) {
        ret = item;
        retMin = min;
      }
    });

    return ret;
  };

/**
 * Returns the min element using the provided predicate.
 *
 * If you need more control over how "min" is defined, consider using `firstBy` instead. minBy might be deprecated in the future!
 *
 * @param fn the predicate
 * @signature
 *    R.minBy(fn)(array)
 *    R.minBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.minBy(x => x.a)
 *    ) // { a: 1 }
 * @dataLast
 * @indexed
 * @category Array
 */
export function minBy<T>(
  fn: (item: T) => number,
): (items: ReadonlyArray<T>) => T | undefined;

/**
 * Returns the min element using the provided predicate.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.minBy(array, fn)
 *    R.minBy.indexed(array, fn)
 * @example
 *    R.minBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 1 }
 * @dataFirst
 * @indexed
 * @category Array
 */
export function minBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number,
): T | undefined;

export function minBy(): unknown {
  return purry(_minBy(false), arguments);
}

export namespace minBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>,
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>,
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(): unknown {
    return purry(_minBy(true), arguments);
  }
}
