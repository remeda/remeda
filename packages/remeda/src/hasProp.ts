import type { KeysOfUnion, Simplify } from "type-fest";
import { purry } from "./purry";

type HasProp<T, Key extends PropertyKey> =
  // Distribute over `T`'s union members so members that don't have `Key` drop
  // out of the narrowed type.
  T extends unknown
    ? Key extends keyof T
      ? // `T &` makes the result structurally a subtype of `T`, satisfying
        // the type-predicate assignability check.
        Simplify<T & Required<Pick<T, Key>>>
      : never
    : never;

/**
 * Checks if `data` has a prop `key`.
 *
 * Uses [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
 * which only checks own properties, skipping properties inherited through the
 * prototype chain.
 *
 * - Use `prop` to read the value.
 *
 * @param data - The object to test.
 * @param key - The key to look up.
 * @signature
 *   hasProp(data, key)
 * @example
 *   hasProp({ a: 1 }, "a"); //=> true
 * @dataFirst
 * @category Guard
 */
export function hasProp<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasProp<T, Key>;

/**
 * Checks if `data` has a prop `key`.
 *
 * Uses [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
 * which only checks own properties, skipping properties inherited through the
 * prototype chain.
 *
 * - Use `prop` to read the value.
 *
 * @param key - The key to look up.
 * @signature
 *   hasProp(key)(data)
 * @example
 *   pipe({ a: 1 }, hasProp("a")); //=> true
 *   filter([] as { a?: number }[], hasProp("a")); //=> typed as { a: number }[]
 * @dataLast
 * @category Guard
 */
export function hasProp<T extends object, Key extends KeysOfUnion<T>>(
  key: Key,
): (data: T) => data is HasProp<T, Key>;

export function hasProp(...args: readonly unknown[]): unknown {
  return purry(hasPropImplementation, args);
}

function hasPropImplementation<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasProp<T, Key> {
  return Object.hasOwn(data, key);
}
