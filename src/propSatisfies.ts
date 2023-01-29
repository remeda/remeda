import { purry } from './purry';

/**
 * Apply predicate to the value at the given prop.
 * @param obj the target object
 * @param prop the property name
 * @param pred the predicate
 * @signature
 *    R.propSatisfies(obj, prop, pred)
 * @example
 *    R.propSatisfies({firstName: 'john'}, 'firstName', (name) => name.length === 4) // => true
 * @data_first
 * @category Object
 */
export function propSatisfies<
  T extends Record<PropertyKey, any>,
  K extends keyof T,
  C extends (v: T[K]) => boolean
>(obj: T, prop: K, pred: C): boolean;

/**
 * Apply predicate to the value at the given prop.
 * @param prop the property name
 * @param pred the predicate
 * @signature
 *    R.propSatisfies(prop, pred)(obj)
 * @example
 *    R.filter([{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}], R.propSatisfies('value', (v) => v % 2 === 0)) // => [0, 2, 4]
 * @data_last
 * @category Object
 */
export function propSatisfies<
  T extends Record<PropertyKey, any>,
  K extends keyof T,
  C extends (v: T[K]) => boolean
>(prop: K, pred: C): (v: T[K]) => boolean;

export function propSatisfies(): any {
  return purry(_propSatisfies, arguments);
}

function _propSatisfies(obj: any, prop: string, pred: any) {
  return pred(obj[prop]);
}
