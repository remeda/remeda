import { purry } from "./purry";
import type { Merge } from "./type-fest/merge";

/**
 * Merges two objects into one by combining their properties, effectively
 * creating a new object that incorporates elements from both. The merge
 * operation prioritizes the second object's properties, allowing them to
 * overwrite those from the first object with the same names.
 *
 * Equivalent to `{ ...data, ...source }`.
 *
 * @param data - The destination object, serving as the basis for the merge.
 * Properties from this object are included in the new object, but may be
 * overwritten by properties from the source object with matching keys.
 * @param source - The source object, whose properties will be included in the
 * new object. If properties in this object share keys with properties in the
 * destination object, the values from the source object will be used in the
 * new object.
 * @returns An object fully-containing `source`, and any properties from `data`
 * that don't share a name with any property in `source`.
 * @signature
 *    R.merge(data, source)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
export function merge<T, Source>(data: T, source: Source): Merge<T, Source>;

/**
 * Merges two objects into one by combining their properties, effectively
 * creating a new object that incorporates elements from both. The merge
 * operation prioritizes the second object's properties, allowing them to
 * overwrite those from the first object with the same names.
 *
 * Equivalent to `{ ...data, ...source }`.
 *
 * @param data - The destination object, serving as the basis for the merge.
 * Properties from this object are included in the new object, but may be
 * overwritten by properties from the source object with matching keys.
 * @param source - The source object, whose properties will be included in the
 * new object. If properties in this object share keys with properties in the
 * destination object, the values from the source object will be used in the
 * new object.
 * @returns An object fully-containing `source`, and any properties from `data`
 * that don't share a name with any property in `source`.
 * @signature
 *    R.merge(source)(data)
 * @example
 *    R.pipe(
 *      { x: 1, y: 2 },
 *      R.merge({ y: 10, z: 2 }),
 *    ); // => { x: 1, y: 10, z: 2 }
 * @dataLast
 * @category Object
 */
export function merge<Source>(source: Source): <T>(data: T) => Merge<T, Source>;

export function merge(): unknown {
  return purry(_merge, arguments);
}

function _merge<T, Source>(data: T, source: Source): Merge<T, Source> {
  return { ...data, ...source };
}
