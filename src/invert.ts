import { purry } from './purry';

type Inverted<T extends object> = T[keyof T] extends PropertyKey
  ? Record<T[keyof T], keyof T>
  : never;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @data_first
 * @category object
 * @pipeable
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @data_last
 * @category object
 * @pipeable
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert() {
  return purry(_invert, arguments);
}

function _invert<T extends object>(object: T): Inverted<T> {
  const result: Record<PropertyKey, keyof T> = {};

  for (const key in object) {
    // @ts-expect-error We ensure that the value is a valid type in the definition of Invertable
    // above.
    result[object[key]] = key;
  }

  return result as Inverted<T>;
}
