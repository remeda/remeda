import { purry } from './purry';
import { PredIndexedOptional, PredIndexed } from './_types';

/**
 * Converts a list of objects into an object indexing the objects by the given key (casted to a string).
 * Use the strict version to maintain the given key's type, so long as it is a valid `PropertyKey`.
 *
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(array, fn)
 *    R.indexBy.strict(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {"3": 'two', "5": 'three'}
 *    R.indexBy.strict(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @indexed
 * @category Array
 * @strict
 */
export function indexBy<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => any
): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * (casted to a string). Use the strict version to maintain the given key's type, so
 * long as it is a valid `PropertyKey`.
 *
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(fn)(array)
 *    R.indexBy.strict(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {"3": 'two', "5": 'three'}
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy.strict(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @indexed
 * @category Array
 * @strict
 */
export function indexBy<T>(
  fn: (item: T) => any
): (array: ReadonlyArray<T>) => Record<string, T>;

export function indexBy() {
  return purry(_indexBy(false), arguments);
}

const _indexBy =
  (indexed: boolean) =>
  <T>(array: Array<T>, fn: PredIndexedOptional<T, any>) => {
    return array.reduce<Record<string, T>>((ret, item, index) => {
      const value = indexed ? fn(item, index, array) : fn(item);
      const key = String(value);
      ret[key] = item;
      return ret;
    }, {});
  };

function indexByStrict<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K
): Partial<Record<K, T>>;

function indexByStrict<K extends PropertyKey, T>(
  fn: (item: T) => K
): (array: ReadonlyArray<T>) => Partial<Record<K, T>>;

function indexByStrict() {
  return purry(_indexByStrict, arguments);
}

const _indexByStrict = <K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K
) => {
  return array.reduce<Partial<Record<K, T>>>((ret, item) => {
    const key = fn(item);
    ret[key] = item;
    return ret;
  }, {});
};

export namespace indexBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, any>
  ): Record<string, T>;
  export function indexed<T>(
    fn: PredIndexed<T, any>
  ): (array: ReadonlyArray<T>) => Record<string, T>;
  export function indexed() {
    return purry(_indexBy(true), arguments);
  }
  export const strict = indexByStrict;
}
