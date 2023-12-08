import type { NarrowedTo } from './_types';

/**
 * Checks if the runtime `typeof` of the param is `object` and not null.
 *
 * Notice that a lot of things in JS are objects, pretty much anything that isn't a primitive type This includes Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Errors, etc...
 *
 * Use `isPlainObject` for a narrower check that only accepts simple struct/shape/record-like objects.
 *
 * @param data the variable to check
 * @signature
 *    R.isObjectType(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    R.isObjectType({}) //=> true
 *    R.isObjectType([]) //=> true
 *    R.isObjectType(Promise.resolve("something")) //=> true
 *    R.isObjectType(new Date()) //=> true
 *    R.isObjectType(new Error("error")) //=> true
 *    R.isObjectType('somethingElse') //=> false
 * @category Guard
 */
export const isObjectType = <T>(
  data: T | object
): data is NarrowedTo<T, object> => typeof data === 'object' && data !== null;
