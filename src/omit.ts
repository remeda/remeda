import { purry } from './purry';

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param object the object
 * @param names the property names
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @data_first
 * @category Object
 */
export function omit<T extends Record<PropertyKey, any>, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>
): Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param object the object
 * @param names the property names
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @data_last
 * @category Object
 */
export function omit<K extends PropertyKey>(
  names: ReadonlyArray<K>
): <T extends Record<PropertyKey, any>>(object: T) => Omit<T, K>;

export function omit() {
  return purry(_omit, arguments);
}

function _omit<T extends Record<PropertyKey, any>, K extends keyof T>(
  object: T,
  names: Array<K>
): Omit<T, K> {
  const set = new Set(names as Array<string>);
  return Object.entries(object).reduce<any>((acc, [name, value]) => {
    if (!set.has(name)) {
      acc[name] = value;
    }
    return acc;
  }, {}) as Omit<T, K>;
}
