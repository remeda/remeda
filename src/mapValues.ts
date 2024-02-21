import { ObjectKeys } from './_types';
import { purry } from './purry';
import { toPairs } from './toPairs';

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
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S
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
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S
): (data: T) => Record<ObjectKeys<T>, S>;

export function mapValues() {
  return purry(_mapValues, arguments);
}

function _mapValues<T extends object>(
  data: T,
  fn: (value: Required<T>[keyof T], key: keyof T) => unknown
) {
  const out: Partial<Record<keyof T, unknown>> = {};
  for (const [key, value] of toPairs.strict(data)) {
    out[key] = fn(value, key);
  }
  return out;
}
