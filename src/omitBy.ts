import { type EnumeratedKeyOf, type EnumeratedValueOf } from "./_types";
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
export function omitBy<T extends object>(
  data: T,
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
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
export function omitBy<T extends object>(
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
): (data: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function omitBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(omitByImplementation, args);
}

function omitByImplementation<T extends object>(
  data: T,
  predicate: (value: unknown, key: string, data: T) => boolean,
): Record<string, unknown> {
  const out: Partial<Record<string, unknown>> = { ...data };

  for (const [key, value] of Object.entries(out)) {
    if (predicate(value, key, data)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- This is the best way to do it!
      delete out[key];
    }
  }

  return out;
}
