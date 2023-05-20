/**
 * Returns the first entry in the object where predicate is true, and undefined otherwise.
 * @param object the object
 * @param fn the predicate
 * @signature
 *   R.findEntry(object, fn)
 * @example
 *   R.findEntry({a: 1, b: 2}, (key, value) => value === 2) // => ['b', 2]
 * @data_first
 * @pipeable
 * @category Object
 */
export function findEntry<T extends Record<PropertyKey, unknown>>(
  object: T,
  fn: (key: keyof T, value: T[keyof T]) => boolean
): [key: keyof T, value: T[keyof T]] | undefined;

/**
 * Returns the first entry in the object where predicate is true, and undefined otherwise.
 * @param fn the predicate
 * @signature
 *   R.findEntry(fn)(object)
 * @example
 *   R.pipe({a: 1, b: 2}, R.findEntry((key, value) => value === 2)) // => ['b', 2]
 * @data_last
 * @pipeable
 * @category Object
 */
export function findEntry<T extends Record<PropertyKey, unknown>>(
  fn: (key: keyof T, value: T[keyof T]) => boolean
): (object: T) => [key: keyof T, value: T[keyof T]] | undefined;

export function findEntry(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _findEntry(data, arg1);
  }
  return _findEntry(arg1, arg2);
}

function _findEntry(object: any, fn: (key: PropertyKey, value: any) => any) {
  for (const key in object) {
    if (fn(key, object[key])) {
      return [key, object[key]];
    }
  }
}
