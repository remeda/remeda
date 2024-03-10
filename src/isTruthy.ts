/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is truthy, false otherwise.
 * @signature
 *    R.isTruthy(data)
 * @example
 *    R.isTruthy('somethingElse') //=> true
 *    R.isTruthy(null) //=> false
 *    R.isTruthy(undefined) //=> false
 *    R.isTruthy(false) //=> false
 *    R.isTruthy(0) //=> false
 *    R.isTruthy('') //=> false
 * @category Guard
 */
// eslint-disable-next-line unicorn/prefer-native-coercion-functions -- This is not entirely correct, our isTruthy also coerces the type.
export function isTruthy<T>(
  data: T,
): data is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(data);
}
