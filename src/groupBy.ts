import { purry } from './purry';
import { NonEmptyArray, PredIndexedOptional, PredIndexed } from './_types';

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
export function groupBy<Item, Key extends PropertyKey>(
  items: readonly Item[],
  fn: (item: Item) => Key
): Partial<Record<Key, NonEmptyArray<Item>>>;

export function groupBy<Item, Key extends PropertyKey>(
  fn: (item: Item) => Key
): (array: readonly Item[]) => Partial<Record<Key, NonEmptyArray<Item>>>;

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
  export function indexed<Item, Key extends PropertyKey>(
    array: readonly Item[],
    fn: PredIndexed<Item, Key>
  ): Partial<Record<Key, NonEmptyArray<Item>>>;
  export function indexed<Item, Key extends PropertyKey>(
    fn: PredIndexed<Item, Key>
  ): (array: readonly Item[]) => Partial<Record<Key, NonEmptyArray<Item>>>;
  export function indexed() {
    return purry(_groupBy(true), arguments);
  }
}
