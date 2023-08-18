import { ObjectKeys } from './_types';

/**
 * Maps values of `object` and keeps the same keys.
 * @param object the object to map
 * @param fn the mapping function
 * @signature
 *    R.mapValues(object, fn)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @data_first
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, any>, S>(
  object: T,
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S
): Record<ObjectKeys<T>, S>;

/**
 * Maps values of `object` and keeps the same keys.
 * @param fn the mapping function
 * @signature
 *    R.mapValues(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @data_last
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, any>, S>(
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S
): (object: T) => Record<ObjectKeys<T>, S>;

export function mapValues(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _mapValues(data, arg1);
  }
  return _mapValues(arg1, arg2);
}

function _mapValues(obj: any, fn: (key: string, value: any) => any) {
  return Object.keys(obj).reduce<any>((acc, key) => {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});
}
