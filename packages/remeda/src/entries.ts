/* eslint-disable @typescript-eslint/no-empty-object-type --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */
import type { Simplify, ValueOf } from "type-fest";
import { purry } from "./purry";
import type { ToString } from "./internal/types/ToString";

type Entry<T> = Simplify<
  ValueOf<{
    // `Object.entries` only returns enumerable keys, skipping symbols.
    [P in Exclude<keyof T, symbol>]-?: [
      // and all keys are converted to strings.
      key: ToString<P>,
      // Optionality doesn't play a factor in the result of entries because its
      // a typing thing, not a runtime thing. We need to remove any `undefined`
      // added just because the prop is optional.
      value: Required<T>[P],
    ];
  }>
>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param data - Object to return keys and values of.
 * @signature
 *    R.entries(object)
 * @example
 *    R.entries({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataFirst
 * @category Object
 */
export function entries<T extends {}>(data: T): Array<Entry<T>>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @signature
 *    R.entries()(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3 }, R.entries()); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataLast
 * @category Object
 */
export function entries(): <T extends {}>(data: T) => Array<Entry<T>>;

export function entries(...args: ReadonlyArray<unknown>): unknown {
  return purry(Object.entries, args);
}
