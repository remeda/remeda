import { NarrowedTo } from './_types';

/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *    R.isArray([5]) //=> true
 *    R.isArray([]) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: T | ArrayLike<unknown>
): data is NarrowedTo<T, ReadonlyArray<unknown>> {
  return Array.isArray(data);
}
