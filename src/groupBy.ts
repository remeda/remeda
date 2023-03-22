import { purry } from './purry';
import { NonEmptyArray, PredIndexedOptional, PredIndexed } from './_types';

/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 * @param items the items to group
 * @param fn the grouping function. When `undefined` is returned the item would
 * be skipped and not grouped under any key.
 * @signature
 *    R.groupBy(array, fn)
 *    R.groupBy.strict(array, fn)
 * @example
 *    R.groupBy(['one', 'two', 'three'], x => x.length) // => {3: ['one', 'two'], 5: ['three']}
 *    R.groupBy.strict([{a: 'cat'}, {b: 'dog'}] as const, prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]} typed Partial<Record<'cat' | 'dog', NonEmptyArray<{a: 'cat' | 'dog'}>>>
 *    R.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @data_first
 * @indexed
 * @strict
 * @category Array
 */
export function groupBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => PropertyKey | undefined
): Record<PropertyKey, NonEmptyArray<T>>;

export function groupBy<T>(
  fn: (item: T) => PropertyKey | undefined
): (array: ReadonlyArray<T>) => Record<PropertyKey, NonEmptyArray<T>>;

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
  <T, Key extends PropertyKey = PropertyKey>(
    array: Array<T>,
    fn: PredIndexedOptional<T, Key>
  ) => {
    const ret: Record<string, Array<T>> = {};
    array.forEach((item, index) => {
      const key = indexed ? fn(item, index, array) : fn(item);
      if (key !== undefined) {
        const actualKey = String(key);
        if (!ret[actualKey]) {
          ret[actualKey] = [];
        }
        ret[actualKey].push(item);
      }
    });
    return ret;
  };

// Redefining the groupBy API with a stricter return type. This API is accessed
// via `groupBy.strict`
interface Strict {
  // Data-First
  <Value, Key extends PropertyKey = PropertyKey>(
    items: ReadonlyArray<Value>,
    fn: (item: Value) => Key | undefined
  ): StrictOut<Value, Key>;

  // Data-Last
  <Value, Key extends PropertyKey = PropertyKey>(
    fn: (item: Value) => Key | undefined
  ): (items: ReadonlyArray<Value>) => StrictOut<Value, Key>;

  readonly indexed: {
    // Data-First
    <Value, Key extends PropertyKey = PropertyKey>(
      items: ReadonlyArray<Value>,
      fn: PredIndexed<Value, Key | undefined>
    ): StrictOut<Value, Key>;

    // Data-Last
    <Value, Key extends PropertyKey = PropertyKey>(
      fn: PredIndexed<Value, Key | undefined>
    ): (items: ReadonlyArray<Value>) => StrictOut<Value, Key>;
  };
}

// Records keyed with generic `string` and `number` have different semantics
// to those with a a union of literal values (e.g. 'cat' | 'dog') when using
// 'noUncheckedIndexedAccess', the former being implicitly `Partial` whereas
// the latter are implicitly `Required`. Because groupBy returns a partial
// record by definition, we need to make sure the result is properly partial
// when using it with a refined key.
type StrictOut<Value, Key extends PropertyKey = PropertyKey> =
  // If either string, number or symbol extend Key it means that Key is at least
  // as wide as them, so we don't need to wrap the returned record with Partial.
  string extends Key
    ? Record<Key, NonEmptyArray<Value>>
    : number extends Key
    ? Record<Key, NonEmptyArray<Value>>
    : symbol extends Key
    ? Record<Key, NonEmptyArray<Value>>
    : // If the key is specific, e.g. 'cat' | 'dog', the result is partial
      // because we can't statically know what values the mapper would return on
      // a specific input
      Partial<Record<Key, NonEmptyArray<Value>>>;

export namespace groupBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, PropertyKey | undefined>
  ): Record<string, NonEmptyArray<T>>;
  export function indexed<T>(
    fn: PredIndexed<T, PropertyKey | undefined>
  ): (array: ReadonlyArray<T>) => Record<string, NonEmptyArray<T>>;
  export function indexed() {
    return purry(_groupBy(true), arguments);
  }

  export const strict: Strict = groupBy;
}
