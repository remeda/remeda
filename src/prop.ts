/**
 * Gets the value of the given property.
 * @param name the property name
 * @signature R.prop(prop)(object)
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @data_last
 * @category Object
 */

interface PropInterface {
  <T, K extends keyof T>(name: K): (obj: T) => T[K];
  <K extends string = string>(name: K): <T extends Record<any, any>>(
    obj: T
  ) => T[K];
}

export const prop: PropInterface = (name: string) => (obj: Record<any, any>) =>
  obj[name];
