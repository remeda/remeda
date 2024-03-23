/**
 * A function that checks if the passed parameter is defined *AND* isn't `null`
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined and isn't `null`, false
 * otherwise.
 * @signature
 *    R.isNonNullish(data)
 * @example
 *    R.isNonNullish('string') //=> true
 *    R.isNonNullish(null) //=> false
 *    R.isNonNullish(undefined) //=> false
 * @strict
 * @category Guard
 * @similarTo ramda isNotNil
 */
export function isNonNullish<T>(data: T): data is NonNullable<T> {
  return data !== undefined && data !== null;
}
