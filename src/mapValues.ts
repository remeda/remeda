import type { ObjectKeys } from "./_types";
import { entries } from "./entries";
import { purry } from "./purry";

type MappedValues<T, S> = { -readonly [P in keyof T]: S };

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
  valueMapper: (value: T[keyof T], key: ObjectKeys<T>, data: T) => S,
): MappedValues<T, S>;

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
  valueMapper: (value: T[keyof T], key: ObjectKeys<T>, data: T) => S,
): (data: T) => MappedValues<T, S>;

export function mapValues(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends object, S>(
  data: T,
  valueMapper: (value: T[keyof T], key: ObjectKeys<T>, data: T) => S,
): MappedValues<T, S> {
  const out: Partial<MappedValues<T, S>> = {};

  for (const [key, value] of entries(data)) {
    // @ts-expect-error [ts2345] - FIXME!
    const mappedValue = valueMapper(value, key, data);
    out[key] = mappedValue;
  }

  return out as MappedValues<T, S>;
}
