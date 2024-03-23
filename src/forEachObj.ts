import { purry } from "./purry";

/**
 * Iterate an object using a defined callback function. The original object is returned.
 *
 * @param object - The object.
 * @param fn - The callback function.
 * @returns The original object.
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, unknown>>(
  object: T,
  fn: (value: T[keyof T], key: keyof T, obj: T) => void,
): T;

/**
 * Iterate an object using a defined callback function. The original object is returned.
 *
 * @param fn - The callback function.
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, unknown>>(
  fn: (value: T[keyof T], key: keyof T, obj: T) => void,
): (object: T) => T;

export function forEachObj(): unknown {
  return purry(forEachObjImplementation, arguments);
}

function forEachObjImplementation<T extends Record<PropertyKey, unknown>>(
  data: T,
  fn: (
    value: T[Extract<keyof T, string>],
    key?: Extract<keyof T, string>,
    obj?: T,
  ) => void,
): T {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const { [key]: val } = data;
      fn(val, key, data);
    }
  }
  return data;
}
