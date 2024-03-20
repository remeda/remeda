/**
 * A function that checks if the passed parameter is either `null` or
 * `undefined` and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is either `null` or `undefined`, false
 * otherwise.
 * @signature
 *    R.isNullish(data)
 * @example
 *    R.isNullish(undefined) //=> true
 *    R.isNullish(null) //=> true
 *    R.isNullish('somethingElse') //=> false
 * @category Guard
 * @mapping lodash isNil
 * @mapping ramda isNil
 */
export function isNullish<T>(data: T): data is Extract<T, null | undefined> {
  return data === null || data === undefined;
}
