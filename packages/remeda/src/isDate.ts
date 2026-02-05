/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Date, false otherwise.
 * @signature
 *    isDate(data)
 * @example
 *    isDate(new Date()) //=> true
 *    isDate('somethingElse') //=> false
 * @category Guard
 */
export function isDate(data: unknown): data is Date {
  return data instanceof Date;
}
