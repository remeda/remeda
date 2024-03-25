import { type EnumeratedKeyOf, type EnumeratedValueOf } from "./_types";
import { purry } from "./purry";

type MappedValues<T extends object, Value> = {
  -readonly [P in keyof T]: P extends symbol ? T[P] : Value;
};

/**
 * Maps values of `object` and keeps the same keys.
 *
 * @param data - The object to map.
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(object, fn)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export function mapValues<T extends object, Value>(
  data: T,
  valueMapper: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => Value,
): MappedValues<T, Value>;

/**
 * Maps values of `object` and keeps the same keys.
 *
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export function mapValues<T extends object, Value>(
  valueMapper: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => Value,
): (data: T) => MappedValues<T, Value>;

export function mapValues(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends Record<string, unknown>, S>(
  data: T,
  valueMapper: (value: unknown, key: string, data: T) => S,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };

  for (const [key, value] of Object.entries(out)) {
    const mappedValue = valueMapper(value, key, data);
    out[key] = mappedValue;
  }

  return out;
}
