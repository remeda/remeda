/**
 * A function that checks if the passed parameter is Nil (null or undefined) and narrows its type accordingly.
 * @param data - The variable to check.
 * @signature
 *    R.isNil(data)
 * @returns True if the passed input is Nil (null or undefined), false otherwise.
 * @example
 *    R.isNil(undefined) //=> true
 *    R.isNil(null) //=> true
 *    R.isNil('somethingElse') //=> false
 * @category Guard
 */
export function isNil<T>(data: T): data is Extract<T, null | undefined> {
  return data == null;
}
