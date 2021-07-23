import { purry } from './purry';

/**
 * Add a new property to an object.
 * @param obj the target object
 * @param prop the property name
 * @param value the property value
 * @signature
 *    R.addProp(obj, prop, value)
 * @example
 *    R.addProp({firstName: 'john'}, 'lastName', 'doe') // => {firstName: 'john', lastName: 'doe'}
 * @data_first
 * @category Object
 */
export function addProp<T extends Record<PropertyKey, any>, K extends string, V>(
  obj: T,
  prop: K,
  value: V
): T & { [x in K]: V };

/**
 * Add a new property to an object.
 * @param prop the property name
 * @param value the property value
 * @signature
 *    R.addProp(prop, value)(obj)
 * @example
 *    R.addProp('lastName', 'doe')({firstName: 'john'}) // => {firstName: 'john', lastName: 'doe'}
 * @data_last
 * @category Object
 */
export function addProp<T extends Record<PropertyKey, any>, K extends string, V>(
  prop: K,
  value: V
): (obj: T) => T & { [x in K]: V };

export function addProp(): any {
  return purry(_addProp, arguments);
}

function _addProp(obj: any, prop: string, value: any) {
  return {
    ...obj,
    [prop]: value,
  };
}
