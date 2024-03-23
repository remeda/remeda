import { purry } from "./purry";

/**
 * Gets the value of the given property.
 *
 * @param data - The object to extract the prop from.
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(data, key);
 * @example
 *   R.prop({ foo: 'bar' }, 'foo'); // => 'bar'
 * @dataFirst
 * @category Object
 */
export function prop<T, K extends keyof T>(data: T, key: K): T[K];

/**
 * Gets the value of the given property.
 *
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(key)(data);
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export function prop<T, K extends keyof T>(key: K): (data: T) => T[K];

export function prop(): unknown {
  return purry(propImplementation, arguments);
}

export function propImplementation<T, K extends keyof T>(
  data: T,
  key: K,
): T[K] {
  const { [key]: value } = data;
  return value;
}
