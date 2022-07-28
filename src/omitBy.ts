import { purry } from './purry';
import { Key } from './_types';

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param object the target object
 * @param fn the predicate
 * @signature R.omitBy(object, fn)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @data_first
 * @category Object
 */
export function omitBy<K extends Key, V>(
  object: Record<K, V>,
  fn: (value: V, key: K) => boolean
): Record<K, V>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param fn the predicate
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @data_last
 * @category Object
 */
export function omitBy<K extends Key, V>(
  fn: (value: V, key: K) => boolean
): (object: Record<K, V>) => Record<K, V>;

export function omitBy() {
  return purry(_omitBy, arguments);
}

function _omitBy(object: any, fn: (value: any, key: any) => boolean) {
  if (object == null) {
    return {};
  }
  return Object.keys(object).reduce((acc, key) => {
    if (!fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as any);
}
