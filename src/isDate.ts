/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isDate(data)
 * @returns true if the passed input is a Date, false otherwise
 * @example
 *    R.isDate(new Date()) //=> true
 *    R.isDate('somethingElse') //=> false
 * @category Guard
 */
export function isDate(data: unknown): data is Date {
  return data instanceof Date;
}
