import { purry } from "./purry";
import type { PredIndexedOptional, PredIndexed } from "./_types";

/**
 * Converts a list of objects into an object indexing the objects by the given key (casted to a string).
 * Use the strict version to maintain the given key's type, so long as it is a valid `PropertyKey`.
 *
 * @param array - The array.
 * @param fn - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 *    R.indexBy.strict(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {"3": 'two', "5": 'three'}
 *    R.indexBy.strict(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @indexed
 * @strict
 * @category Array
 * @similarTo lodash keyBy
 * @similarTo ramda indexBy
 */
export function indexBy<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => unknown,
): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * (casted to a string). Use the strict version to maintain the given key's type, so
 * long as it is a valid `PropertyKey`.
 *
 * @param fn - The indexing function.
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
 * @strict
 * @category Array
 * @similarTo lodash keyBy
 * @similarTo ramda indexBy
 */
export function indexBy<T>(
  fn: (item: T) => unknown,
): (array: ReadonlyArray<T>) => Record<string, T>;

export function indexBy(): unknown {
  return purry(_indexBy(false), arguments);
}

const _indexBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, unknown>) => {
    const out: Record<string, T> = {};
    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump our Typescript target version we can use Array.prototype.entries to iterate over the elements and index at the same time.
      const item = array[index]!;
      const value = indexed ? fn(item, index, array) : fn(item);
      const key = String(value);
      out[key] = item;
    }
    return out;
  };

function indexByStrict<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>>;

function indexByStrict<K extends PropertyKey, T>(
  fn: (item: T) => K,
): (array: ReadonlyArray<T>) => Partial<Record<K, T>>;

function indexByStrict(): unknown {
  return purry(_indexByStrict, arguments);
}

function _indexByStrict<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>> {
  const out: Partial<Record<K, T>> = {};

  for (const item of array) {
    const key = fn(item);
    out[key] = item;
  }

  return out;
}

export namespace indexBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, unknown>,
  ): Record<string, T>;
  export function indexed<T>(
    fn: PredIndexed<T, unknown>,
  ): (array: ReadonlyArray<T>) => Record<string, T>;
  export function indexed(): unknown {
    return purry(_indexBy(true), arguments);
  }
  export const strict = indexByStrict;
}
