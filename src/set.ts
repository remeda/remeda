import type { Simplify } from "type-fest";
import type { IsSingleLiteral } from "./internal/types";
import { purry } from "./purry";

type SetPropValue<T, K extends keyof T, V extends Required<T>[K]> = Simplify<
  Omit<T, K> &
    (IsSingleLiteral<K> extends true
      ? // If it's a single literal we need to remove the optionality because it
        // is ensured that the prop would always we set.
        { -readonly [P in K]-?: V }
      : // But for any other situation the prop might not be the one that was
        // set, so we need to maintain both it's type, and it's optionality.
        { -readonly [P in K]: T[P] | V })
>;

/**
 * Sets the `value` at `prop` of `object`.
 *
 * To add a new property to an object, or to override it's type use `addProp`
 * instead.
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
): SetPropValue<T, K, V>;

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
): (obj: T) => SetPropValue<T, K, V>;

export function set(...args: ReadonlyArray<unknown>): unknown {
  return purry(setImplementation, args);
}

const setImplementation = <T, K extends keyof T, V extends Required<T>[K]>(
  obj: T,
  prop: K,
  value: V,
): SetPropValue<T, K, V> => ({ ...obj, [prop]: value });
