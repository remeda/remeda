import { type NarrowedTo } from './_types';
import { isObjectType } from './isObjectType';

/**
 * Checks if the param is a simple record-like object, that is, an object with
 * keys and values. The values themselves can be anything, including other
 * objects, functions, classes, etc.
 *
 * Use `isObjectType` for a wider check that accepts anything JS considers an
 * object
 *
 * @param data the variable to check
 * @signature
 *    R.isRecord(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    R.isRecord({}) //=> true
 *    R.isRecord({ a: 123 }) //=> true
 *    R.isRecord([]) //=> false
 *    R.isRecord(Promise.resolve("something")) //=> false
 *    R.isRecord(new Date()) //=> false
 *    R.isRecord(new Error("error")) //=> false
 *    R.isRecord('somethingElse') //=> false
 * @category Guard
 */
export function isRecord<T>(
  data: T | Record<PropertyKey, unknown>
): data is NarrowedTo<T, Record<PropertyKey, unknown>> {
  if (!isObjectType(data)) {
    return false;
  }

  const proto = Object.getPrototypeOf(data);
  return proto === null || proto === Object.prototype;
}
