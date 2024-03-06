import type { IterableContainer } from "./_types";
import { purry } from "./purry";

/**
 * Returns a new array containing the keys of the array or object.
 * @param source - Either an array or an object.
 * @signature
 *    R.keys(source)
 *    R.keys.strict(source)
 * @example
 *    R.keys(['x', 'y', 'z']) // => ['0', '1', '2']
 *    R.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    R.keys.strict({ a: 'x', b: 'y', 5: 'z' } as const ) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 *    R.pipe(['x', 'y', 'z'], R.keys) // => ['0', '1', '2']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.keys) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.keys,
 *      R.first(),
 *    ) // => 'a'
 *    R.pipe({ a: 'x', b: 'y', 5: 'z' } as const, R.keys.strict) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 * @dataFirst
 * @pipeable
 * @strict
 * @category Object
 */
export function keys(
  source: ArrayLike<unknown> | Readonly<Record<PropertyKey, unknown>>,
): Array<string>;

/**
 * Returns a new array containing the keys of the array or object.
 * @param source - Either an array or an object.
 * @signature
 *    R.keys()(source)
 *    R.keys.strict()(source)
 * @example
 *    R.pipe(['x', 'y', 'z'], R.keys()) // => ['0', '1', '2']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.keys()) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.keys(),
 *      R.first(),
 *    ) // => 'a'
 *    R.pipe({ a: 'x', b: 'y', 5: 'z' } as const, R.keys.strict()) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 * @dataLast
 * @pipeable
 * @strict
 * @category Object
 */
// TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
// export function keys(): (
//   source: Record<PropertyKey, unknown> | ArrayLike<unknown>,
// ) => Array<string>;

export function keys(): unknown {
  return purry(Object.keys, arguments);
}

type Strict = // (): <T extends object>(data: T) => Keys<T>;
  // TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
  <T extends object>(data: T) => Keys<T>;
type Keys<T> = T extends IterableContainer ? ArrayKeys<T> : ObjectKeys<T>;

// The keys output can mirror the input when it is an array/tuple. We do this by
// "mapping" each item "key" (which is actually an index) as its own value. This
// would maintain the shape, even including labels.
type ArrayKeys<T extends IterableContainer> = {
  -readonly [Index in keyof T]: Index extends number | string
    ? // Notice that we coalesce the values as strings, this is because in JS,
      // Object.keys always returns strings, even for arrays.
      `${IsIndexAfterSpread<T, Index> extends true ? number : Index}`
    : // Index is typed as a symbol, this can't happen, but we need to guard
      // against it for typescript.
      never;
};

type IsIndexAfterSpread<
  T extends IterableContainer,
  Index extends number | string,
> =
  IndicesAfterSpread<T> extends never
    ? false
    : Index extends `${IndicesAfterSpread<T>}`
      ? true
      : false;

// Find the index of the tuple where a spread item is located, and return all
// indices in the tuple which are located after it. The tuple could be prefixed
// by any number of literal items. If the input is a simple array it would
// return 0 (as expected), and if the tuple doesn't contain a spread element it
// would return never.
type IndicesAfterSpread<
  T extends ReadonlyArray<unknown> | [],
  // We use this type to count how many items we consumed, it's just a pseudo-
  // element that is used for its length.
  Iterations extends ReadonlyArray<unknown> = [],
> = T[number] extends never
  ? never
  : T extends readonly [unknown, ...infer Tail]
    ? IndicesAfterSpread<Tail, [unknown, ...Iterations]>
    : T extends readonly [...infer Head, unknown]
      ?
          | IndicesAfterSpread<Head, [unknown, ...Iterations]>
          | Iterations["length"]
      : Iterations["length"];

type ObjectKeys<T> =
  T extends Record<PropertyKey, never>
    ? []
    : Array<`${Exclude<keyof T, symbol>}`>;
export namespace keys {
  export const strict = keys as Strict;
}
