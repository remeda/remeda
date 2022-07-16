import { purry } from './purry';
import { Key } from './_types';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param fn the predicate
 * @signature R.pickBy(object, fn)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @data_first
 * @category Object
 */
export function pickBy<K extends Key, V>(
  object: Record<K, V>,
  fn: (value: V, key: K) => boolean
): Record<K, V>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param fn the predicate
 * @signature R.pickBy(fn)(object)
 * @example
 *    R.pickBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {A: 3, B: 4}
 * @data_last
 * @category Object
 */
export function pickBy<K extends Key, V>(
  fn: (value: V, key: K) => boolean
): (object: Record<K, V>) => Record<K, V>;

export function pickBy() {
  return purry(_pickBy, arguments);
}

function _pickBy(object: any, fn: (value: any, key: any) => boolean) {
  if (object == null) {
    return {};
  }
  return Object.keys(object).reduce((acc, key) => {
    if (fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as any);
}
