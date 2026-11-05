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
 *    mapValues(data, mapper)
 * @example
 *    mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
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
 *    mapValues(mapper)(data)
 * @example
 *    pipe({a: 1, b: 2}, mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
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

export function mapValues(...args: readonly unknown[]): unknown {
  return purry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends object, Value>(
  data: T,
  valueMapper: (value: unknown, key: string, data: T) => Value,
): Record<string, Value> {
  const out: Record<string, Value> = {};

  for (const entry of Object.entries(data)) {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- benchmarking surfaced that destructuring the entry array is slower.
    const key = entry[0];
    const mappedValue = valueMapper(entry[1], key, data);
    if (key === "__proto__") {
      // We want `__proto__` to act just like any other key, but assigning it
      // runs the setter inherited from `Object.prototype` instead of creating
      // a property. Defining it directly creates the same own data property
      // that assigning creates for all *other* keys.
      Object.defineProperty(out, "__proto__", {
        value: mappedValue,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } else {
      out[key] = mappedValue;
    }
  }

  return out;
}
