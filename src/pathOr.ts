import { purry } from './purry';

/**
 * Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.
 * @param object the target object
 * @param path the path of the property to get
 * @param defaultValue the default value
 * @signature R.pathOr(object, array, defaultValue)
 * @example
 *    R.pathOr({x: 10}, ['y'], 2) // 2
 *    R.pathOr({y: 10}, ['y'], 2) // 10
 * @data_first
 * @category Object
 */
export function pathOr<T, A extends keyof T>(
  object: T,
  path: [A],
  defaultValue: T[A]
): T[A];

export function pathOr<T, A extends keyof T, B extends keyof T[A]>(
  object: T,
  path: [A, B],
  defaultValue: T[A][B]
): T[A][B];

export function pathOr<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B]
>(object: T, path: [A, B, C], defaultValue: T[A][B][C]): T[A][B][C];

/**
 * Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.
 * @param object the target object
 * @param path the path of the property to get
 * @param defaultValue the default value
 * @signature R.pathOr(array, defaultValue)(object)
 * @example
 *    R.pipe({x: 10}, R.pathOr(['y'], 2)) // 2
 *    R.pipe({y: 10}, R.pathOr(['y'], 2)) // 10
 * @data_last
 * @category Object
 */
export function pathOr<T, A extends keyof T>(
  path: [A],
  defaultValue: T[A]
): (object: T) => T[A];

export function pathOr<T, A extends keyof T, B extends keyof T[A]>(
  path: [A, B],
  defaultValue: T[A][B]
): (object: T) => T[A][B];

export function pathOr<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B]
>(path: [A, B, C], defaultValue: T[A][B][C]): (object: T) => T[A][B][C];

export function pathOr() {
  return purry(_pathOr, arguments);
}

function _pathOr(object: any, path: any[], defaultValue: any): any {
  let current = object;
  for (const prop of path) {
    if (current == null || current[prop] == null) {
      return defaultValue;
    }
    current = current[prop];
  }
  return current;
}
