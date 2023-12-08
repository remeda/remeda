import type { NarrowedTo } from './_types';
import { isObjectType } from './isObjectType';

/**
 * Checks if the param is a simple struct/shape/record-like object, that is, an object with keys and values. The values themselves can be anything, including other objects, functions, classes, etc.
 *
 * Use `isObjectType` for a wider check that accepts anything JS considers an object
 *
 * @param data the variable to check
 * @signature
 *    R.isPlainObject(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    R.isPlainObject({}) //=> true
 *    R.isPlainObject({ a: 123 }) //=> true
 *    R.isPlainObject([]) //=> false
 *    R.isPlainObject(Promise.resolve("something")) //=> false
 *    R.isPlainObject(new Date()) //=> false
 *    R.isPlainObject(new Error("error")) //=> false
 *    R.isPlainObject('somethingElse') //=> false
 * @category Guard
 */
export function isPlainObject<T>(
  data: T | Record<PropertyKey, unknown>
): data is NarrowedTo<T, Record<PropertyKey, unknown>> {
  if (!isObjectType(data)) {
    return false;
  }

  const proto = Object.getPrototypeOf(data);
  return proto === null || proto === Object.prototype;
}
