/* eslint-disable @typescript-eslint/no-empty-object-type --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type { Simplify } from "type-fest";
import { purry } from "./purry";

// Object.entries only returns enumerable keys, skipping symbols. It also
// only returns string keys, translating numbers to strings.
type EntryForKey<T, Key extends keyof T> = Key extends number | string
  ? [key: `${Key}`, value: Required<T>[Key]]
  : never;

type Entry<T> = Simplify<{ [P in keyof T]-?: EntryForKey<T, P> }[keyof T]>;

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
