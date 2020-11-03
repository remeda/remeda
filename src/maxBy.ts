import { purry } from './purry';
import { _toLazyIndexed } from './_toLazyIndexed';
import { _toSingle } from './_toSingle';
import { PredIndexed, PredIndexedOptional } from './_types';

const _maxBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, number>
) => {
  let ret: T | undefined = undefined;
  let retMax: number | undefined = undefined;
  array.forEach((item, i) => {
    const max = indexed ? fn(item, i, array) : fn(item);
    if (retMax === undefined || max > retMax) {
      ret = item;
      retMax = max;
    }
  });

  return ret;
};

/**
 * Returns the max element using the provided predicate.
 * @param fn the predicate
 * @signature
 *    R.maxBy(fn)(array)
 *    R.maxBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.maxBy(x => x.a)
 *    ) // { a: 5 }
 * @data_last
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  fn: (item: T) => number
): (items: readonly T[]) => T | undefined;

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
 * @data_first
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  items: readonly T[],
  fn: (item: T) => number
): T | undefined;

export function maxBy() {
  return purry(_maxBy(false), arguments);
}

export namespace maxBy {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, number>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: readonly T[]) => T | undefined;
  export function indexed() {
    return purry(_maxBy(true), arguments);
  }
}
