import { purry } from './purry';
import { PredIndexedOptional, PredIndexed } from './_types';

/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 * @param items the items to group
 * @param fn the grouping function
 * @signature
 *    R.groupBy(array, fn)
 * @example
 *    R.groupBy(['one', 'two', 'three'], x => x.length) // => {3: ['one', 'two'], 5: ['three']}
 * @data_first
 * @indexed
 * @category Array
 */
export function groupBy<T>(
  items: readonly T[],
  fn: (item: T) => any
): Record<string, T[]>;

export function groupBy<T>(
  fn: (item: T) => any
): (array: readonly T[]) => Record<string, T[]>;

/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 * @param fn the grouping function
 * @signature
 *    R.groupBy(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'three'], R.groupBy(x => x.length)) // => {3: ['one', 'two'], 5: ['three']}
 * @data_last
 * @indexed
 * @category Array
 */
export function groupBy() {
  return purry(_groupBy(false), arguments);
}

const _groupBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, any>
) => {
  const ret: Record<string, T[]> = {};
  array.forEach((item, index) => {
    const value = indexed ? fn(item, index, array) : fn(item);
    const key = String(value);
    if (!ret[key]) {
      ret[key] = [];
    }
    ret[key].push(item);
  });
  return ret;
};

export namespace groupBy {
  export function indexed<T, K>(
    array: readonly T[],
    fn: PredIndexed<T, any>
  ): Record<string, T[]>;
  export function indexed<T, K>(
    fn: PredIndexed<T, any>
  ): (array: readonly T[]) => Record<string, T[]>;
  export function indexed() {
    return purry(_groupBy(true), arguments);
  }
}
