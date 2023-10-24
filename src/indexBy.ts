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
 * @dataFirst
 * @indexed
 * @category Array
 */
export function indexBy<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K
): Record<K, T>;

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
 * @dataLast
 * @indexed
 * @category Array
 */
export function indexBy<K extends PropertyKey, T>(
  fn: (item: T) => K
): (array: ReadonlyArray<T>) => Record<K, T>;

export function indexBy() {
  return purry(_indexBy(false), arguments);
}

const _indexBy =
  (indexed: boolean) =>
  <K extends PropertyKey, T>(
    array: Array<T>,
    fn: PredIndexedOptional<T, K>
  ) => {
    const initialvalues: Partial<Record<K, T>> = {};
    return array.reduce((ret, item, index) => {
      const key = indexed ? fn(item, index, array) : fn(item);
      ret[key] = item;
      return ret;
    }, initialvalues) as Record<K, T>;
  };

export namespace indexBy {
  export function indexed<K extends PropertyKey, T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, K>
  ): Record<K, T>;
  export function indexed<K extends PropertyKey, T>(
    fn: PredIndexed<T, K>
  ): (array: ReadonlyArray<T>) => Record<K, T>;
  export function indexed() {
    return purry(_indexBy(true), arguments);
  }
}
