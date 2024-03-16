import { isDeepEqual } from "./isDeepEqual";
import { purry } from "./purry";
import type { Merge } from "./type-fest/merge";

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
 * @category Object
 */
export function hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
  // @ts-expect-error: typescript doesn't infer merges correctly
): data is Merge<T, S>;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @param object - The object to test.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Object
 */
export function hasSubObject<T, S extends Partial<T>>(
  subObject: S,
  // @ts-expect-error: typescript doesn't infer merges correctly
): (data: T) => data is Merge<T, S>;

export function hasSubObject(): unknown {
  return purry(_hasSubObject, arguments);
}

function _hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
  // @ts-expect-error: typescript doesn't infer merges correctly
): data is Merge<T, S> {
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
