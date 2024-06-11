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

type KeyMapperKey<T> =
  T extends Record<infer K, unknown>
    ? EnumerableStringKeyOf<{ [P in K]: unknown }>
    : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferredRecordValue<T> = T extends Record<any, infer V> ? V : never;

type KeyMapperValue<T> = InferredRecordValue<{
  [K in keyof T]: EnumerableStringKeyedValueOf<T>;
}>;

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
  keyMapper: (key: KeyMapperKey<T>, value: KeyMapperValue<T>, data: T) => S,
): ExactRecord<S, KeyMapperValue<T>>;

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
  keyMapper: (key: KeyMapperKey<T>, value: KeyMapperValue<T>, data: T) => S,
): (data: T) => ExactRecord<S, KeyMapperValue<T>>;

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
