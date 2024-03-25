import { type EnumeratedKeyOf, type EnumeratedValueOf } from "./_types";
import { purry } from "./purry";

type Inverted<T extends object> =
  EnumeratedValueOf<T> extends PropertyKey
    ? Record<EnumeratedValueOf<T>, EnumeratedKeyOf<T>>
    : never;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @pipeable
 * @category Object
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @pipeable
 * @category Object
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert(...args: ReadonlyArray<unknown>): unknown {
  return purry(_invert, args);
}

function _invert(
  data: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  for (const [key, value] of Object.entries(data)) {
    result[value] = key;
  }

  return result;
}
