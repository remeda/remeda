import { purry } from './purry';
import { _toLazyIndexed } from './_toLazyIndexed';
import { _toSingle } from './_toSingle';
import { PredIndexed, PredIndexedOptional } from './_types';

const _minBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, number>
) => {
  let ret: T | undefined = undefined;
  let retMin: number | undefined = undefined;
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
 * @param fn the predicate
 * @signature
 *    R.minBy(fn)(array)
 *    R.minBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.minBy(x => x.a)
 *    ) // { a: 1 }
 * @data_last
 * @indexed
 * @category Array
 */
export function minBy<T>(
  fn: (item: T) => number
): (items: readonly T[]) => T | undefined;

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
 * @data_first
 * @indexed
 * @category Array
 */
export function minBy<T>(
  items: readonly T[],
  fn: (item: T) => number
): T | undefined;

export function minBy() {
  return purry(_minBy(false), arguments);
}

export namespace minBy {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, number>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: readonly T[]) => T | undefined;
  export function indexed() {
    return purry(_minBy(true), arguments);
  }
}
