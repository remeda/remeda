import type { KeysOfUnion } from "type-fest";
import { purry } from "./purry";

// Distribute over `T`'s union members. Each member that has `Key` keeps it,
// with the optional modifier removed; members that don't have `Key` drop out
// because the runtime check rules them out. The `T &` prefix makes the
// resulting type structurally a subtype of `T`, satisfying the type-predicate
// assignability constraint without an explicit suppression.
type HasKey<T, Key extends PropertyKey> = T extends unknown
  ? Key extends keyof T
    ? T & Required<Pick<T, Key>>
    : never
  : never;

/**
 * Checks whether `key` is an own property of `data`. Mirrors `Object.hasOwn`,
 * so own properties whose value is `undefined` return `true` and inherited
 * prototype properties (like `toString`) return `false`.
 *
 * Acts as a type-predicate: when `key` is declared as optional on `data`, the
 * narrowed type drops the optional modifier; when `data` is a union, members
 * that don't contain `key` are dropped.
 *
 * @param data - The object to test.
 * @param key - The key to look up. Constrained to keys that could plausibly
 * exist on `data` so typos surface as type errors.
 * @signature
 *   hasKey(data, key)
 * @example
 *   hasKey({ a: 1 }, "a"); //=> true
 *   hasKey({ a: undefined }, "a"); //=> true
 *   hasKey({}, "toString"); //=> false (inherited, not own)
 * @dataFirst
 * @category Object
 */
export function hasKey<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasKey<T, Key>;

/**
 * Checks whether `key` is an own property of `data`. Mirrors `Object.hasOwn`,
 * so own properties whose value is `undefined` return `true` and inherited
 * prototype properties (like `toString`) return `false`.
 *
 * Acts as a type-predicate: when `key` is declared as optional on `data`, the
 * narrowed type drops the optional modifier; when `data` is a union, members
 * that don't contain `key` are dropped.
 *
 * @param key - The key to look up. Constrained to keys that could plausibly
 * exist on `data` so typos surface as type errors.
 * @signature
 *   hasKey(key)(data)
 * @example
 *   pipe({ a: 1 }, hasKey("a")); //=> true
 *   filter(
 *     [{ a: 1 }, { b: 2 }] as Array<{ a?: number; b?: number }>,
 *     hasKey("a"),
 *   ); //=> typed as Array<{ a: number; b?: number }>
 * @dataLast
 * @category Object
 */
export function hasKey<T extends object, Key extends KeysOfUnion<T>>(
  key: Key,
): (data: T) => data is HasKey<T, Key>;

export function hasKey(...args: readonly unknown[]): unknown {
  return purry(hasKeyImplementation, args);
}

function hasKeyImplementation<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasKey<T, Key> {
  return Object.hasOwn(data, key);
}
