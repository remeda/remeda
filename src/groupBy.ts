import { purry } from './purry';
import { NonEmptyArray, PredIndexedOptional, PredIndexed } from './_types';

// Records keyed with generic `string` and `number` have different semantics
// to those with a a union of literal values (e.g. 'cat' | 'dog') when using
// 'noUncheckedIndexedAccess', the former being implicitly `Partial` whereas
// the latter are implicitly `Required`. Because groupBy returns a partial
// record by definition, we need to make sure the result is properly partial
// when using it with a refined key.
type Out<Value, Key extends PropertyKey = PropertyKey> =
  // Key === string
  string extends Key
    ? Record<string, NonEmptyArray<Value>>
    : // Key === number
    number extends Key
    ? Record<number, NonEmptyArray<Value>>
    : // Key === symbol (do we need this case? can symbols be generic?)
    symbol extends Key
    ? Record<symbol, NonEmptyArray<Value>>
    : // If the key is specific, e.g. 'cat' | 'dog', the result is partial because
      // we can't statically know what values the mapper would return on a
      // specific input
      Partial<Record<Key, NonEmptyArray<Value>>>;

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
export function groupBy<Value, Key extends PropertyKey = PropertyKey>(
  items: readonly Value[],
  fn: (item: Value) => Key
): Out<Value, Key>;

export function groupBy<Value, Key extends PropertyKey = PropertyKey>(
  fn: (item: Value) => Key
): (array: readonly Value[]) => Out<Value, Key>;

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

const _groupBy =
  (indexed: boolean) =>
  <T>(array: T[], fn: PredIndexedOptional<T, any>) => {
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
  export function indexed<Value, Key extends PropertyKey = PropertyKey>(
    array: readonly Value[],
    fn: PredIndexed<Value, Key>
  ): Out<Value, Key>;
  export function indexed<Value, Key extends PropertyKey = PropertyKey>(
    fn: PredIndexed<Value, Key>
  ): (array: readonly Value[]) => Out<Value, Key>;
  export function indexed() {
    return purry(_groupBy(true), arguments);
  }
}
