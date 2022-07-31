import { purry } from './purry';

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
export function omitBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): T extends Record<any, any> ? T : Partial<T>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param fn the predicate
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @data_last
 * @category Object
 */
export function omitBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): (object: T) => T extends Record<any, any> ? T : Partial<T>;

export function omitBy() {
  return purry(_omitBy, arguments);
}

function _omitBy(object: any, fn: (value: any, key: any) => boolean) {
  return Object.keys(object).reduce((acc, key) => {
    if (!fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as any);
}
