/* eslint-disable @typescript-eslint/ban-types --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

export type EntryForKey<T, K extends keyof T> = [key: K, value: Required<T>[K]];

type EntryOf<T> = Simplify<{ [K in keyof T]-?: EntryForKey<T, K> }[keyof T]>;

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
export function entries<T extends {}>(data: T): Array<EntryOf<T>>;

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
export function entries(): <T extends {}>(data: T) => Array<EntryOf<T>>;

export function entries(): unknown {
  return purry(Object.entries, arguments);
}
