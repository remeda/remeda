import { purry } from "./purry";
import type { Merge } from "./type-fest/merge";

/**
 * Spreads the properties of the second object into the first object, overriding
 * any existing properties; equivalent to `{ ...data, ...other }`.
 *
 * @param data - The first object, shared props will be overridden.
 * @param other - The second object, this object would be fully contained within
 * the result object.
 * @signature
 *    R.merge(data, other)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
export function merge<T, S>(data: T, other: S): Merge<T, S>;

/**
 * Spreads the properties of the second object into the first object, overriding
 * any existing properties; equivalent to `{ ...data, ...other }`.
 *
 * @param data - The first object, shared props will be overridden.
 * @param other - The second object, this object would be fully contained within
 * the result object.
 * @signature
 *    R.merge(other)(data)
 * @example
 *    R.pipe({ x: 1, y: 2 }, R.merge({ y: 10, z: 2 })) // => { x: 1, y: 10, z: 2 }
 * @dataLast
 * @category Object
 */
export function merge<S>(other: S): <T>(data: T) => Merge<T, S>;

export function merge(): unknown {
  return purry(_merge, arguments);
}

function _merge<T, S>(data: T, other: S): Merge<T, S> {
  return { ...data, ...other };
}
