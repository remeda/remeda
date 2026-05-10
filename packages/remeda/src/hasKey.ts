import type { KeysOfUnion, SetRequired } from "type-fest";
import { purry } from "./purry";

// Distribute over `T`'s union members. Each member that has `Key` keeps it
// (with the optional modifier removed via type-fest's `SetRequired`); members
// that don't have `Key` drop out because the runtime check rules them out.
// The leading `T &` makes the result structurally a subtype of `T`, which is
// required for the type-predicate assignability check.
type HasKey<T, Key extends PropertyKey> = T extends unknown
  ? Key extends keyof T
    ? T & SetRequired<T, Key>
    : never
  : never;

/**
 * Checks whether `key` is an own property of `data`, mirroring
 * [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn).
 * Inherited properties on the prototype chain are ignored.
 *
 * - Use `prop` to read the value.
 * - Use `hasSubObject` to test multiple keys at once.
 *
 * @param data - The object to test.
 * @param key - The key to look up. Constrained to keys that could plausibly
 * exist on `data` so typos surface as type errors.
 * @signature
 *   hasKey(data, key)
 * @example
 *   hasKey({ a: 1 }, "a"); //=> true
 *   hasKey({}, "toString"); //=> false (inherited, not own)
 * @dataFirst
 * @category Object
 */
export function hasKey<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasKey<T, Key>;

/**
 * Checks whether `key` is an own property of `data`, mirroring
 * [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn).
 * Inherited properties on the prototype chain are ignored.
 *
 * - Use `prop` to read the value.
 * - Use `hasSubObject` to test multiple keys at once.
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
