/**
 * A function that checks if the passed parameter is not `null` and narrows its type accordingly.
 * Notice that `undefined` is not null!
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    isNonNull(data)
 * @example
 *    isNonNull('string') //=> true
 *    isNonNull(null) //=> false
 *    isNonNull(undefined) //=> true
 * @category Guard
 */
export function isNonNull<T>(data: T | null): data is T {
  return data !== null;
}
