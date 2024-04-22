import {
  type EnumerableStringKeyOf,
  type EnumerableStringKeyedValueOf,
} from "./internal/types";
import { purry } from "./purry";

/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param data - The object who'se entries would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
export function forEachObj<T extends object>(
  data: T,
  callbackfn: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    obj: T,
  ) => void,
): void;

/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original object (the ref itself, not a shallow copy of it).
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
export function forEachObj<T extends object>(
  callbackfn: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    obj: T,
  ) => void,
): (object: T) => T;

export function forEachObj(...args: ReadonlyArray<unknown>): unknown {
  return purry(forEachObjImplementation, args);
}

function forEachObjImplementation<T extends object>(
  data: T,
  fn: (value: unknown, key: string, data: T) => void,
): T {
  for (const [key, value] of Object.entries(data)) {
    fn(value, key, data);
  }
  return data;
}
