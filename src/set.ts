import { purry } from './purry';

/**
 * Sets the `value` at `prop` of `object`.
 * @param obj the target method
 * @param prop the property name
 * @param value the value to set
 * @signature
 *    R.set(obj, prop, value)
 * @example
 *    R.set({ a: 1 }, 'a', 2) // => { a: 2 }
 * @data_first
 * @category Object
 */
export function set<T, K extends keyof T, A extends T[K]>(obj: T, prop: K, value: A): Omit<T, K> & { [key in K]: A };

/**
 * Sets the `value` at `prop` of `object`.
 * @param prop the property name
 * @param value the value to set
 * @signature
 *    R.set(prop, value)(obj)
 * @example
 *    R.pipe({ a: 1 }, R.set('a', 2)) // => { a: 2 }
 * @data_last
 * @category Object
 */
export function set<T, K extends keyof T, A extends T[K]>(prop: K, value: A): (obj: T) => Omit<T, K> & { [key in K]: A };

export function set() {
  return purry(_set, arguments);
}

function _set(obj: any, prop: string, value: any) {
  return {
    ...obj,
    [prop]: value,
  };
}
