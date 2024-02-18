/**
 * A function equivalent to TypeScript’s built-in `Capitalize` utility type.
 *
 * @param string The string to capitalize.
 * @signature
 *    R.capitalize(string)
 * @example
 *    R.capitalize(`hello`) // => `Hello`
 * @dataLast
 * @category String
 * @strict
 */
export const capitalize = <T extends string>(string: T): Capitalize<T> =>
  `${string[0]?.toUpperCase() ?? ""}${string.slice(1)}` as Capitalize<T>;
