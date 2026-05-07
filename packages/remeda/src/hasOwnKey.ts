import { purry } from "./purry";

/**
 * Checks if `data` has `key` as an own property, mirroring `Object.hasOwn`.
 * Inherited properties on the prototype chain are ignored, but own properties
 * whose value is `undefined` still return `true`.
 *
 * Acts as a type-predicate, narrowing `data` to require `key` to be present.
 * The narrowed value type is `unknown` because runtime presence makes no claim
 * about the value — use `prop` to read it. To follow the prototype chain
 * instead (i.e. mirror the `in` operator), use `hasKey`.
 *
 * @param data - The object to test.
 * @param key - The key to look up.
 * @signature
 *   R.hasOwnKey(data, key)
 * @example
 *   R.hasOwnKey({ a: 1 }, "a"); //=> true
 *   R.hasOwnKey({ a: 1 }, "b"); //=> false
 *   R.hasOwnKey({ a: undefined }, "a"); //=> true
 *   R.hasOwnKey({}, "toString"); //=> false (inherited, not own)
 * @dataFirst
 * @category Object
 */
export function hasOwnKey<T extends object, Key extends PropertyKey>(
  data: T,
  key: Key,
): data is T & Record<Key, unknown>;

/**
 * Checks if `data` has `key` as an own property, mirroring `Object.hasOwn`.
 * Inherited properties on the prototype chain are ignored, but own properties
 * whose value is `undefined` still return `true`.
 *
 * Acts as a type-predicate, narrowing `data` to require `key` to be present.
 * The narrowed value type is `unknown` because runtime presence makes no claim
 * about the value — use `prop` to read it. To follow the prototype chain
 * instead (i.e. mirror the `in` operator), use `hasKey`.
 *
 * @param key - The key to look up.
 * @signature
 *   R.hasOwnKey(key)(data)
 * @example
 *   R.pipe({ a: 1 }, R.hasOwnKey("a")); //=> true
 *   R.pipe({ a: 1 }, R.hasOwnKey("b")); //=> false
 *   R.pipe({ a: undefined }, R.hasOwnKey("a")); //=> true
 * @dataLast
 * @category Object
 */
export function hasOwnKey<Key extends PropertyKey>(
  key: Key,
): <T extends object>(data: T) => data is T & Record<Key, unknown>;

export function hasOwnKey(...args: readonly unknown[]): unknown {
  return purry(hasOwnKeyImplementation, args);
}

function hasOwnKeyImplementation<T extends object, Key extends PropertyKey>(
  data: T,
  key: Key,
): data is T & Record<Key, unknown> {
  return Object.hasOwn(data, key);
}
