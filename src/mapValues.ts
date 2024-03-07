import type { ObjectKeys } from "./_types";
import { purry } from "./purry";
import { toPairs } from "./toPairs";

/**
 * Maps values of `object` and keeps the same keys.
 * @param data the object to map
 * @param fn the mapping function
 * @signature
 *    R.mapValues(object, fn)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, unknown>, S>(
  data: T,
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S,
): Record<ObjectKeys<T>, S>;

/**
 * Maps values of `object` and keeps the same keys.
 * @param fn the mapping function
 * @signature
 *    R.mapValues(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, unknown>, S>(
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S,
): (data: T) => Record<ObjectKeys<T>, S>;

export function mapValues(): unknown {
  return purry(_mapValues, arguments);
}

function _mapValues<T extends Record<PropertyKey, unknown>, S>(
  data: T,
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S,
): Record<ObjectKeys<T>, S> {
  const out: Partial<Record<ObjectKeys<T>, S>> = {};
  for (const [key, value] of toPairs.strict(data)) {
    // @ts-expect-error [ts2345] - FIXME!
    const mappedValue = fn(value, key);
    // @ts-expect-error [ts2536] - FIXME!
    out[key] = mappedValue;
  }
  // @ts-expect-error [ts2322] - We build the object incrementally so the type can't represent the final object.
  return out;
}
