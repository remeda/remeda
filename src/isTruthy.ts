/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly.
 * @param data - The variable to check.
 * @signature
 *    R.isTruthy(data)
 * @returns True if the passed input is truthy, false otherwise.
 * @example
 *    R.isTruthy('somethingElse') //=> true
 *    R.isTruthy(null) //=> false
 *    R.isTruthy(undefined) //=> false
 *    R.isTruthy(false) //=> false
 *    R.isTruthy(0) //=> false
 *    R.isTruthy('') //=> false
 * @category Guard
 */
export function isTruthy<T>(
  data: T,
): data is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(data);
}
