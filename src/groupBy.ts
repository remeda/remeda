import { purry } from "./purry";
import type { NonEmptyArray, PredIndexedOptional, PredIndexed } from "./_types";

// Records keyed with generic `string` and `number` have different semantics
// to those with a a union of literal values (e.g. 'cat' | 'dog') when using
// 'noUncheckedIndexedAccess', the former being implicitly `Partial` whereas
// the latter are implicitly `Required`. Because groupBy returns a partial
// record by definition, we need to make sure the result is properly partial
// when using it with a refined key.
type Grouped<Value, Key extends PropertyKey = PropertyKey> =
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

/**
 * Splits a collection into sets, grouped by the result of running each value
 * through `fn`.
 *
 * @param items - The items to group.
 * @param fn - The grouping function. When `undefined` is returned the item
 * would be skipped and not grouped under any key.
 * @signature
 *    R.groupBy(array, fn)
 * @example
 *    R.groupBy([{a: 'cat'}, {a: 'dog'}] as const, R.prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @indexed
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  items: ReadonlyArray<T>,
  fn: (item: T) => Key | undefined,
): Grouped<T, Key>;

/**
 * Splits a collection into sets, grouped by the result of running each value
 * through `fn`.
 *
 * @param fn - The grouping function. When `undefined` is returned the item
 * would be skipped and not grouped under any key.
 * @signature
 *    R.groupBy(fn)(array);
 * @example
 *    R.pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      R.groupBy(R.prop('a'),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.pipe(
 *      [0, 1],
 *      R.groupBy(x => x % 2 === 0 ? 'even' : undefined),
 *    ); // => {even: [0]}
 * @dataLast
 * @indexed
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  fn: (item: T) => Key | undefined,
): (items: ReadonlyArray<T>) => Grouped<T, Key>;

export function groupBy(): unknown {
  return purry(_groupBy(false), arguments);
}

const _groupBy =
  (indexed: boolean) =>
  <T, Key extends PropertyKey = PropertyKey>(
    array: ReadonlyArray<T>,
    fn: PredIndexedOptional<T, Key | undefined>,
  ) => {
    const ret: Record<string, Array<T>> = {};

    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump our Typescript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value.
      const item = array[index]!;
      const key = indexed ? fn(item, index, array) : fn(item);
      if (key !== undefined) {
        const actualKey = String(key);
        // eslint-disable-next-line @typescript-eslint/prefer-destructuring
        let items = ret[actualKey];
        if (items === undefined) {
          items = [];
          ret[actualKey] = items;
        }
        items.push(item);
      }
    }

    return ret;
  };

export namespace groupBy {
  export function indexed<Value, Key extends PropertyKey = PropertyKey>(
    items: ReadonlyArray<Value>,
    fn: PredIndexed<Value, Key | undefined>,
  ): Grouped<Value, Key>;

  export function indexed<Value, Key extends PropertyKey = PropertyKey>(
    fn: PredIndexed<Value, Key | undefined>,
  ): (items: ReadonlyArray<Value>) => Grouped<Value, Key>;

  export function indexed(): unknown {
    return purry(_groupBy(true), arguments);
  }
}
