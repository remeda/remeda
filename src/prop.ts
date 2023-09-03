/**
 * Gets the value of the given property.
 * @param propName the property name
 * @signature R.prop(prop)(object)
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export const prop =
  <T, K extends keyof T = keyof T>(propName: K) =>
  ({ [propName]: value }: T) =>
    value;
