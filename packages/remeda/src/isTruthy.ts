/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is truthy, false otherwise.
 * @signature
 *    isTruthy(data)
 * @example
 *    isTruthy('somethingElse') //=> true
 *    isTruthy(null) //=> false
 *    isTruthy(undefined) //=> false
 *    isTruthy(false) //=> false
 *    isTruthy(0) //=> false
 *    isTruthy('') //=> false
 * @category Guard
 */
// eslint-disable-next-line unicorn/prefer-native-coercion-functions -- This is not entirely correct, our isTruthy also coerces the type.
export function isTruthy<T>(
  data: T,
): data is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(data);
}
