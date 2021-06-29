/**
 * Maps keys of `object` and keeps the same values.
 * @param object the object to map
 * @param fn the mapping function
 * @signature
 *    R.mapKeys(object, fn)
 * @example
 *    R.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @data_first
 * @category Object
 */
export function mapKeys<T, S extends keyof any>(
  object: T,
  fn: (key: keyof T, value: T[keyof T]) => S
): Record<S, T[keyof T]>;

/**
 * Maps keys of `object` and keeps the same values.
 * @param fn the mapping function
 * @signature
 *    R.mapKeys(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @data_last
 * @category Object
 */
export function mapKeys<T, S extends keyof any>(
  fn: (key: keyof T, value: T[keyof T]) => S
): (object: T) => Record<S, T[keyof T]>;

export function mapKeys(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _mapKeys(data, arg1);
  }
  return _mapKeys(arg1, arg2);
}

function _mapKeys(obj: any, fn: (key: string, value: any) => any) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[fn(key, obj[key])] = obj[key];
    return acc;
  }, {} as any);
}
