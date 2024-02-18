/**
 * A narrowly-typed version of `String.prototype.toLowerCase`.
 *
 * @param string The string to lowercase.
 * @signature
 *    R.toLowerCase(string)
 * @example
 *    R.toLowerCase(`Hello`) // => `hello`
 * @dataLast
 * @category String
 * @strict
 */
export const toLowerCase = <T extends string>(string: T): Lowercase<T> =>
  string.toLowerCase() as Lowercase<T>;
