import { purry3 } from "./internal/purryByArity";
import type { UpsertProp } from "./internal/types/UpsertProp";

/**
 * Sets the `value` at `prop` of `data`.
 *
 * To add a new property to an object, or to override its type, use `addProp`
 * instead, and to set a property within a nested object use `setPath`.
 *
 * @param data - The target object.
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    set(data, prop, value)
 * @example
 *    set({ a: 1 }, 'a', 2) // => { a: 2 }
 * @dataFirst
 * @category Object
 */
export function set<T, K extends keyof T, V extends Required<T>[K]>(
  data: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V>;

/**
 * Sets the `value` at `prop` of `data`.
 *
 * To add a new property to an object, or to override it's type use `addProp`
 * instead.
 *
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    set(prop, value)(data)
 * @example
 *    pipe({ a: 1 }, set('a', 2)) // => { a: 2 }
 * @dataLast
 * @category Object
 */
export function set<T, K extends keyof T, V extends Required<T>[K]>(
  prop: K,
  value: V,
): (data: T) => UpsertProp<T, K, V>;

export function set(
  dataOrProp: unknown,
  propOrValue?: unknown,
  value?: unknown,
): unknown {
  return purry3(
    setImplementation,
    arguments.length,
    dataOrProp,
    propOrValue,
    value,
  );
}

const setImplementation = <T, K extends keyof T, V extends Required<T>[K]>(
  data: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V> =>
  // @ts-expect-error [ts2322] - Hard to type
  ({ ...data, [prop]: value });
