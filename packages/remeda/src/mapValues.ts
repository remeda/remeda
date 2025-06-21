import type { Simplify } from "type-fest";
import type { EnumerableStringKeyOf } from "./internal/types/EnumerableStringKeyOf";
import type { EnumerableStringKeyedValueOf } from "./internal/types/EnumerableStringKeyedValueOf";
import { purry } from "./purry";

type MappedValues<T extends object, Value> = Simplify<{
  -readonly [P in keyof T as P extends number | string ? P : never]: Value;
}>;

/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param data - The object to map.
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(data, mapper)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export function mapValues<T extends object, Value>(
  data: T,
  valueMapper: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => Value,
): MappedValues<T, Value>;

/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(mapper)(data)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export function mapValues<T extends object, Value>(
  valueMapper: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => Value,
): (data: T) => MappedValues<T, Value>;

export function mapValues(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends Record<string, any>, Value>(
  data: T,
  valueMapper: (value: T[keyof T], key: keyof T, data: T) => Value,
): Record<keyof T, Value> {
  const out = {} as Record<keyof T, Value>;

  for (const [key, value] of Object.entries(data)) {
    const mappedValue = valueMapper(value as T[keyof T], key as keyof T, data);
    out[key as keyof T] = mappedValue;
  }

  return out;
}

