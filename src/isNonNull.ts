/**
 * A function that checks if the passed parameter is not `null` and narrows its type accordingly.
 * Notice that `undefined` is not null!
 * @param data the variable to check
 * @signature
 *    R.isNonNull(data)
 * @returns true if the passed input is defined, false otherwise
 * @example
 *    R.isNonNull('string') //=> true
 *    R.isNonNull(null) //=> false
 *    R.isNonNull(undefined) //=> true
 * @category Guard
 */
export function isNonNull<T>(data: T | null): data is T {
  return data !== null;
}
