import { purry } from "./purry";
import type { Merge } from "./type-fest/merge";

/**
 * Spreads the properties of the second object into the first object, overriding
 * any existing properties; equivalent to `{ ...data, ...source }`.
 *
 * @param data - The destination object, shared props will be overridden.
 * @param source - The source object, this object would be fully contained
 * within the result object.
 * @signature
 *    R.merge(data, source)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
export function merge<T, Source>(data: T, source: Source): Merge<T, Source>;

/**
 * Spreads the properties of the second object into the first object, overriding
 * any existing properties; equivalent to `{ ...data, ...source }`.
 *
 * @param data - The destination object, shared props will be overridden.
 * @param source - The source object, this object would be fully contained
 * within the result object.
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
