/**
 * A narrowly-typed version of `String.prototype.toUpperCase`.
 *
 * @param string The string to uppercase.
 * @signature
 *    R.toUpperCase(string)
 * @example
 *    R.toUpperCase(`Hello`) // => `HELLO`
 * @dataLast
 * @category String
 * @strict
 */
export const toUpperCase = <T extends string>(string: T): Uppercase<T> =>
  string.toUpperCase() as Uppercase<T>;
