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
export function groupBy<T, K extends keyof any>(
  items: readonly T[],
  fn: (item: T) => K | ReadonlyArray<K>
): Record<K, T[]>;

export function groupBy<T, K extends keyof any>(
  fn: (item: T) => K | ReadonlyArray<K>
): (array: readonly T[]) => Record<K, T[]>;

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

function isArray<T>(data: T): data is Extract<T, Array<any> | ReadonlyArray<any>> {
  return Array.isArray(data)
}

const _groupBy = (indexed: boolean) => <T, K extends keyof any>(
  array: T[],
  fn: PredIndexedOptional<T, K | ReadonlyArray<K>>
) => {
  const ret: Record<keyof any, T[]> = {};
  array.forEach((item, index) => {
    const value = indexed ? fn(item, index, array) : fn(item);
    const addToGroup = (key: K, value: T) => {
      if (!ret[key]) {
        ret[key] = [];
      }
      ret[key].push(value);
    }
    if (isArray(value)) {
      value.forEach((key) => {
        addToGroup(key, item)
      })
      return
    }
    addToGroup(value, item)
  });
  return ret;
};

export namespace groupBy {
  export function indexed<T, K extends keyof any>(
    array: readonly T[],
    fn: PredIndexed<T, K | ReadonlyArray<K>>
  ): Record<K, T[]>;
  export function indexed<T, K extends keyof any>(
    fn: PredIndexed<T, K | ReadonlyArray<K>>
  ): (array: readonly T[]) => Record<K, T[]>;
  export function indexed() {
    return purry(_groupBy(true), arguments);
  }
}
