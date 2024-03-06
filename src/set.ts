import { purry } from "./purry";

/**
 * Sets the `value` at `prop` of `object`.
 * @param obj - The target method.
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    R.set(obj, prop, value)
 * @example
 *    R.set({ a: 1 }, 'a', 2) // => { a: 2 }
 * @dataFirst
 * @category Object
 */
export function set<T, K extends keyof T>(obj: T, prop: K, value: T[K]): T;

/**
 * Sets the `value` at `prop` of `object`.
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    R.set(prop, value)(obj)
 * @example
 *    R.pipe({ a: 1 }, R.set('a', 2)) // => { a: 2 }
 * @dataLast
 * @category Object
 */
export function set<T, K extends keyof T>(prop: K, value: T[K]): (obj: T) => T;

export function set() {
  return purry(_set, arguments);
}

function _set<T, K extends keyof T>(obj: T, prop: K, value: T[K]): T {
  return {
    ...obj,
    [prop]: value,
  };
}
