import { type EnumeratedKeyOf, type EnumeratedValueOf } from "./_types";
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
export function pickBy<T extends object>(
  data: T,
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
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
export function pickBy<T extends object>(
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
): (data: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function pickBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(pickByImplementation, args);
}

function pickByImplementation<T extends object>(
  data: T,
  predicate: (value: unknown, key: string, data: T) => boolean,
): Record<string, unknown> {
  const out: Partial<Record<string, unknown>> = {};

  for (const [key, value] of Object.entries(data)) {
    if (predicate(value, key, data)) {
      out[key] = value;
    }
  }

  return out;
}
