import { purry } from "./purry";

type Inverted<T extends object> = T[keyof T] extends PropertyKey
  ? Record<T[keyof T], keyof T>
  : never;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
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
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object - The object.
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @pipeable
 * @category Object
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert(): unknown {
  return purry(_invert, arguments);
}

function _invert(
  object: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  for (const key in object) {
    // @see https://eslint.org/docs/latest/rules/guard-for-in
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[object[key]!] = key;
    }
  }

  return result;
}
