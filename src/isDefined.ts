/**
 * A function that checks if the passed parameter is defined and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isDefined(data)
 * @returns true if the passed input is defined, false otherwise
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> false
 *    R.isDefined(undefined) //=> false
 * @category Guard
 */
export function isDefined<T>(data: T): data is NonNullable<T> {
  return typeof data !== 'undefined' && data !== null;
}
