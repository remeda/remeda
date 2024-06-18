/* eslint-disable @typescript-eslint/ban-types --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type {
  EnumerableStringKeyOf,
  EnumerableStringKeyedValueOf,
  ExactRecord,
} from "./internal/types";
import { purry } from "./purry";

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param data - The object to map.
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(object, fn)
 * @example
 *    R.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => S,
): ExactRecord<S, EnumerableStringKeyedValueOf<T>>;

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => S,
): (data: T) => ExactRecord<S, EnumerableStringKeyedValueOf<T>>;

export function mapKeys(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapKeysImplementation, args);
}

function mapKeysImplementation<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (key: string, value: unknown, data: T) => S,
): Partial<Record<S, unknown>> {
  const out: Partial<Record<S, unknown>> = {};

  for (const [key, value] of Object.entries(data)) {
    const mappedKey = keyMapper(key, value, data);
    out[mappedKey] = value;
  }

  return out;
}
