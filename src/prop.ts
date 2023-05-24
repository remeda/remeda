/**
 * Gets the value of the given property.
 * @param prop the property name
 * @signature R.prop(prop)(object)
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @data_last
 * @category Object
 */
export function prop<T, K extends keyof T>(prop: K): (data: T) => T[K];
export function prop<K extends PropertyKey>(
  prop: K
): <T>(data: T) => K extends keyof T ? T[K] : undefined;

export function prop<T, K extends keyof T>(prop: K): (data: T) => unknown {
  return data => data[prop];
}
