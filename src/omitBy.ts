import { keys } from "./keys";
import { purry } from "./purry";

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param data - The target object.
 * @param predicate - The predicate.
 * @signature R.omitBy(object, fn)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
export function omitBy<T>(
  data: T,
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param predicate - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export function omitBy<T>(
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): (data: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function omitBy(): unknown {
  return purry(omitByImplementation, arguments);
}

function omitByImplementation<T>(
  data: T,
  predicate: <K extends keyof T>(value: T[K], key: K, data: T) => boolean,
): Partial<T> {
  if (data === undefined || data === null) {
    return data;
  }

  const out: Partial<T> = {};

  for (const key of keys(data)) {
    if (!predicate(data[key], key, data)) {
      out[key] = data[key];
    }
  }

  return out;
}
