import type { UpsertProp } from "./internal/types/UpsertProp";
import { purry } from "./purry";

/**
 * Sets the `value` at `prop` of `object`.
 *
 * To add a new property to an object, or to override its type, use `addProp`
 * instead, and to set a property within a nested object use `setPath`.
 *
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
export function set<T, K extends keyof T, V extends Required<T>[K]>(
  obj: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V>;

/**
 * Sets the `value` at `prop` of `object`.
 *
 * To add a new property to an object, or to override it's type use `addProp`
 * instead.
 *
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    R.set(prop, value)(obj)
 * @example
 *    R.pipe({ a: 1 }, R.set('a', 2)) // => { a: 2 }
 * @dataLast
 * @category Object
 */
export function set<T, K extends keyof T, V extends Required<T>[K]>(
  prop: K,
  value: V,
): (obj: T) => UpsertProp<T, K, V>;

export function set(...args: ReadonlyArray<unknown>): unknown {
  return purry(setImplementation, args);
}

const setImplementation = <T, K extends keyof T, V extends Required<T>[K]>(
  obj: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V> =>
  // @ts-expect-error [ts2322] - Hard to type
  ({ ...obj, [prop]: value });
