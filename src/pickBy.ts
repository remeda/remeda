import { keys } from "./keys";
import { purry } from "./purry";

/**
 * Creates an object composed of the picked `object` properties.
 * @param object - The target object.
 * @param fn - The predicate.
 * @signature R.pickBy(object, fn)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
export function pickBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param fn - The predicate.
 * @signature R.pickBy(fn)(object)
 * @example
 *    R.pickBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
export function pickBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function pickBy() {
  return purry(_pickBy, arguments);
}

function _pickBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): Partial<T> {
  if (object == null) {
    return {};
  }
  return keys.strict(object).reduce<Partial<T>>((acc, key) => {
    if (fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}
