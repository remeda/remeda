/**
 * Gets the value of the given property.
 * @param name the property name
 * @signature R.prop(prop)(object)
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @data_last
 * @category Object
 */
export function prop<T, K extends keyof T>(name: K) {
  return (obj: T) => obj[name];
}
