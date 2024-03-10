import { equals } from "./equals";
import { purry } from "./purry";

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `equals`.
 * @param object the object to test
 * @param subObject the sub-object to test against
 * @signature
 *    R.hasSubObject(object, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Object
 */
export function hasSubObject<S extends object, T extends S = S>(
  object: T,
  subObject: S,
): object is S & T;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `equals`.
 * @param subObject the sub-object to test against
 * @param object the object to test
 * @signature
 *    R.hasSubObject(subObject)(object)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Object
 */
export function hasSubObject<S extends object>(
  subObject: S,
): <T extends S = S>(object: T) => object is S & T;

export function hasSubObject(): unknown {
  return purry(_hasSubObject, arguments);
}

function _hasSubObject<S extends object, T extends S = S>(
  object: T,
  subObject: S,
): object is S & T {
  for (const key of Object.keys(subObject)) {
    // @ts-expect-error [ts7053] - This indexing is safe:
    if (!equals(subObject[key], object[key])) {
      return false;
    }
  }
  return true;
}
