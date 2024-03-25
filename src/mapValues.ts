import {
  type EnumeratedKeyOf,
  type EnumeratedValueOf,
  type Mapped,
} from "./_types";
import { purry } from "./purry";

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
export function mapValues<T extends object, S>(
  data: T,
  valueMapper: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => S,
): Mapped<T, S>;

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
export function mapValues<T extends object, S>(
  valueMapper: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => S,
): (data: T) => Mapped<T, S>;

export function mapValues(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends object, S>(
  data: T,
  valueMapper: (value: unknown, key: string, data: T) => S,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const mappedValue = valueMapper(value, key, data);
    out[key] = mappedValue;
  }

  return out;
}
