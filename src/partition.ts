import { purry } from './purry';
import { PredIndexedOptional, PredIndexed } from './_types';

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param items the items to split
 * @param predicate the function invoked per iteration
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @data_first
 * @indexed
 * @category Array
 */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param predicate the grouping function
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @data_last
 * @indexed
 * @category Array
 */
export function partition<T>(
  predicate: (item: T) => boolean
): (array: readonly T[]) => [T[], T[]];

export function partition() {
  return purry(_partition(false), arguments);
}

const _partition = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, any>
) => {
  const ret: [T[], T[]] = [[], []];
  array.forEach((item, index) => {
    const matches = indexed ? fn(item, index, array) : fn(item);
    ret[matches ? 0 : 1].push(item);
  });
  return ret;
};

export namespace partition {
  export function indexed<T, K>(
    array: readonly T[],
    predicate: PredIndexed<T, boolean>
  ): [T[], T[]];
  export function indexed<T, K>(
    predicate: PredIndexed<T, boolean>
  ): (array: readonly T[]) => [T[], T[]];
  export function indexed() {
    return purry(_partition(true), arguments);
  }
}
