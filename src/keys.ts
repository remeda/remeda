import type { EnumeratedKeyOf, IterableContainer } from "./_types";
import { purry } from "./purry";

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
  T extends Record<PropertyKey, never> ? [] : Array<EnumeratedKeyOf<T>>;

/**
 * Returns a new array containing the keys of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.keys(source)
 * @example
 *    R.keys(['x', 'y', 'z']); // => ['0', '1', '2']
 *    R.keys({ a: 'x', b: 'y', 5: 'z' }); // => ['a', 'b', '5']
 * @dataFirst
 * @pipeable
 * @category Object
 */
export function keys<T extends object>(data: T): Keys<T>;

/**
 * Returns a new array containing the keys of the array or object.
 *
 * @signature
 *    R.keys()(source)
 * @example
 *    R.Pipe(['x', 'y', 'z'], keys()); // => ['0', '1', '2']
 *    R.pipe({ a: 'x', b: 'y', 5: 'z' } as const, R.keys()) // => ['a', 'b', '5']
 * @dataLast
 * @pipeable
 * @category Object
 */
export function keys(): <T extends object>(data: T) => Keys<T>;

export function keys(...args: ReadonlyArray<unknown>): unknown {
  return purry(Object.keys, args);
}
