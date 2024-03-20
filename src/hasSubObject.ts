import { isDeepEqual } from "./isDeepEqual";
import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(data, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 * @mapping lodash isMatch
 * @mapping ramda where
 */
export function hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
): // TODO: want to use data is Merge<T, S> here, but it's a typescript error. fix after we allow @ts-expect-error in the build process
data is Simplify<S & T>;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 * @mapping lodash isMatch
 * @mapping ramda where
 */
export function hasSubObject<T, S extends Partial<T>>(
  subObject: S,
): (data: T) => data is Simplify<S & T>;

export function hasSubObject(): unknown {
  return purry(_hasSubObject, arguments);
}

function _hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
): data is Simplify<S & T> {
  for (const key of Object.keys(subObject)) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      return false;
    }

    // @ts-expect-error [ts7053] - key is in both subObject and data:
    if (!isDeepEqual(subObject[key], data[key])) {
      return false;
    }
  }
  return true;
}
