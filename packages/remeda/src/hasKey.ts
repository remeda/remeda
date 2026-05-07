import { purry } from "./purry";

/**
 * Checks if `key` is in `data`, mirroring the `in` operator. Returns `true`
 * for any key found on the object or anywhere on its prototype chain, and
 * for own properties whose value is `undefined`.
 *
 * Acts as a type-predicate, narrowing `data` to require `key` to be present.
 * The narrowed value type is `unknown` because runtime presence makes no claim
 * about the value — use `prop` to read it. To restrict the check to own
 * properties only, use `hasOwnKey` instead.
 *
 * @param data - The object to test.
 * @param key - The key to look up.
 * @signature
 *   R.hasKey(data, key)
 * @example
 *   R.hasKey({ a: 1 }, "a"); //=> true
 *   R.hasKey({ a: 1 }, "b"); //=> false
 *   R.hasKey({ a: undefined }, "a"); //=> true
 *   R.hasKey({}, "toString"); //=> true (inherited from Object.prototype)
 * @dataFirst
 * @category Object
 */
export function hasKey<T extends object, Key extends PropertyKey>(
  data: T,
  key: Key,
): data is T & Record<Key, unknown>;

/**
 * Checks if `key` is in `data`, mirroring the `in` operator. Returns `true`
 * for any key found on the object or anywhere on its prototype chain, and
 * for own properties whose value is `undefined`.
 *
 * Acts as a type-predicate, narrowing `data` to require `key` to be present.
 * The narrowed value type is `unknown` because runtime presence makes no claim
 * about the value — use `prop` to read it. To restrict the check to own
 * properties only, use `hasOwnKey` instead.
 *
 * @param key - The key to look up.
 * @signature
 *   R.hasKey(key)(data)
 * @example
 *   R.pipe({ a: 1 }, R.hasKey("a")); //=> true
 *   R.pipe({ a: 1 }, R.hasKey("b")); //=> false
 *   R.pipe({ a: undefined }, R.hasKey("a")); //=> true
 * @dataLast
 * @category Object
 */
export function hasKey<Key extends PropertyKey>(
  key: Key,
): <T extends object>(data: T) => data is T & Record<Key, unknown>;

export function hasKey(...args: readonly unknown[]): unknown {
  return purry(hasKeyImplementation, args);
}

function hasKeyImplementation<T extends object, Key extends PropertyKey>(
  data: T,
  key: Key,
): data is T & Record<Key, unknown> {
  return key in data;
}
