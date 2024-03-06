import { purry } from "./purry";
import type { PredIndexed, PredIndexedOptional } from "./_types";

const _maxBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let ret: T | undefined;
    let retMax: number | undefined;

    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump our Typescript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value.
      const item = array[index]!;
      const max = indexed ? fn(item, index, array) : fn(item);
      if (retMax === undefined || max > retMax) {
        ret = item;
        retMax = max;
      }
    }

    return ret;
  };

/**
 * Returns the max element using the provided predicate.
 *
 * If you need more control over how "max" is defined, consider using `firstBy` instead. maxBy might be deprecated in the future!
 *
 * @param fn the predicate
 * @signature
 *    R.maxBy(fn)(array)
 *    R.maxBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.maxBy(x => x.a)
 *    ) // { a: 5 }
 * @dataLast
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  fn: (item: T) => number,
): (items: ReadonlyArray<T>) => T | undefined;

/**
 * Returns the max element using the provided predicate.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.maxBy(array, fn)
 *    R.maxBy.indexed(array, fn)
 * @example
 *    R.maxBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 5 }
 * @dataFirst
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number,
): T | undefined;

export function maxBy(): unknown {
  return purry(_maxBy(false), arguments);
}

export namespace maxBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>,
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>,
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(): unknown {
    return purry(_maxBy(true), arguments);
  }
}
