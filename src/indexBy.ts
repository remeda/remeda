import { purry } from './purry';
import { PredIndexedOptional, PredIndexed } from './_types';

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @data_first
 * @indexed
 * @category Array
 */
export function indexBy<T>(
  array: readonly T[],
  fn: (item: T) => any
): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @data_last
 * @indexed
 * @category Array
 */
export function indexBy<T>(
  fn: (item: T) => any
): (array: readonly T[]) => Record<string, T>;

export function indexBy() {
  return purry(_indexBy(false), arguments);
}

const _indexBy = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, any>
) => {
  return array.reduce((ret, item, index) => {
    const value = indexed ? fn(item, index, array) : fn(item);
    const key = String(value);
    ret[key] = item;
    return ret;
  }, {} as Record<string, T>);
};

export namespace indexBy {
  export function indexed<T, K>(
    array: readonly T[],
    fn: PredIndexed<T, any>
  ): Record<string, T>;
  export function indexed<T, K>(
    fn: PredIndexed<T, any>
  ): (array: readonly T[]) => Record<string, T>;
  export function indexed() {
    return purry(_indexBy(true), arguments);
  }
}
