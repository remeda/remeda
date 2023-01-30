import { purry } from './purry';
import { equals } from './equals';

/**
 * Compare an expected value to the value at the given prop.
 * @param obj the target object
 * @param prop the property name
 * @param expected the expected value
 * @signature
 *    R.propEq(obj, prop, expected)
 * @example
 *    R.propEq({firstName: 'john'}, 'firstName', 'john') // => true
 * @data_first
 * @category Object
 */
export function propEq<T, K extends keyof T>(
  obj: T,
  prop: K,
  expected: T[K]
): boolean;

/**
 * Apply predicate to the value at the given prop.
 * @param prop the property name
 * @param expected the expected value
 * @signature
 *    R.propEq(prop, expected)(obj)
 * @example
 *    R.filter([{firstName: 'john', lastName: 'doe'}, {firstName: 'jane', lastName: 'doe'}], R.propEq('firstName', 'jane')) // => [{firstName: 'jane', lastName: 'doe'}]
 * @data_last
 * @category Object
 */
export function propEq<T, K extends keyof T>(
  prop: K,
  expected: T[K]
): (obj: T) => boolean;

export function propEq(): any {
  return purry(_propEq, arguments);
}

function _propEq(obj: any, prop: string, expected: any) {
  return equals(obj[prop], expected);
}
