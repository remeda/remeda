import { equals } from './equals';
import { purry } from './purry';

/**
 * Checks if `subObject` is a subobject of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `equals`.
 * @param object the object to test
 * @param subObject the subobject to test against
 * @signature
 *    R.hasSubobject(object, subObject)
 * @example
 *    R.hasSubobject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubobject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubobject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Object
 */
export function hasSubobject<
  S extends Record<PropertyKey, unknown>,
  T extends S,
>(object: T, subObject: S): boolean;

/**
 * Checks if `subObject` is a subobject of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `equals`.
 * @param subObject the subobject to test against
 * @param object the object to test
 * @signature
 *    R.hasSubobject(subObject)(object)
 * @example
 *    R.hasSubobject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubobject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubobject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Object
 */
export function hasSubobject<S extends Record<PropertyKey, unknown>>(
  subObject: S
): <T extends S>(object: T) => boolean;

export function hasSubobject() {
  return purry(_hasSubobject, arguments);
}

function _hasSubobject<S extends Record<PropertyKey, unknown>, T extends S>(
  object: T,
  subObject: S
): boolean {
  for (const key of Object.keys(subObject)) {
    if (!equals(subObject[key], object[key])) {
      return false;
    }
  }
  return true;
}
