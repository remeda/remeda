import { keys } from "./keys";
import { purry } from "./purry";

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param data - The target object.
 * @param predicate - The predicate.
 * @signature R.pickBy(object, fn)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
export function pickBy<T>(
  data: T,
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param predicate - The predicate.
 * @signature R.pickBy(fn)(object)
 * @example
 *    R.pickBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
export function pickBy<T>(
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): (data: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function pickBy(): unknown {
  return purry(pickByImplementation, arguments);
}

function pickByImplementation<T>(
  data: T,
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): Partial<T> {
  if (data === null || data === undefined) {
    return {};
  }

  const out: Partial<T> = {};

  for (const key of keys(data)) {
    if (predicate(data[key], key, data)) {
      out[key] = data[key];
    }
  }

  return out;
}
