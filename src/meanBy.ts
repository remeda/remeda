import { purry } from './purry';
import { PredIndexed, PredIndexedOptional } from './_types';

const _meanBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, number>
) => {
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
 * @data_last
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  fn: (item: T) => number
): (items: readonly T[]) => number;

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
 * @data_first
 * @indexed
 * @category Array
 */

export function meanBy<T>(items: readonly T[], fn: (item: T) => number): number;

export function meanBy() {
  return purry(_meanBy(false), arguments);
}

export namespace meanBy {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, number>
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: readonly T[]) => number;

  export function indexed() {
    return purry(_meanBy(true), arguments);
  }
}
