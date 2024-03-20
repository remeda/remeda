import type { NarrowedTo } from "./_types";

/**
 * Checks if the given parameter is of type `"object"` via `typeof`, excluding `null`.
 *
 * It's important to note that in JavaScript, many entities are considered objects, like Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Promise, Errors, and more. Although technically an object too, `null` is not considered an object by this function, so that its easier to narrow nullables.
 *
 * For a more specific check that is limited to plain objects (simple struct/shape/record-like objects), consider using `isPlainObject` instead. For a simpler check that only removes `null` from the type prefer `isNonNull` or `isDefined`.
 *
 * @param data - The variable to be checked for being an object type.
 * @returns The input type, narrowed to only objects.
 * @signature
 *    R.isObjectType(data)
 * @example
 *    // true
 *    R.isObjectType({}) //=> true
 *    R.isObjectType([]) //=> true
 *    R.isObjectType(Promise.resolve("something")) //=> true
 *    R.isObjectType(new Date()) //=> true
 *    R.isObjectType(new Error("error")) //=> true
 *
 *    // false
 *    R.isObjectType('somethingElse') //=> false
 *    R.isObjectType(null) //=> false
 * @dataFirst
 * @category Guard
 * @mapping lodash isObjectLike
 */
export const isObjectType = <T>(
  data: T | object,
): data is NarrowedTo<T, object> => typeof data === "object" && data !== null;
