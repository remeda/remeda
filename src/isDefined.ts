/**
 * A function that checks if the passed parameter is defined (`!== undefined`)
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    R.isDefined(data)
 *    R.isDefined.strict(data)
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> true
 *    R.isDefined(undefined) //=> false
 * @category Guard
 */
export function isDefined<T>(data: T | undefined): data is T {
  return data !== undefined;
}
