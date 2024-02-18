/**
 * A function equivalent to TypeScript’s built-in `Uncapitalize` utility type.
 *
 * @param string The string to uncapitalize.
 * @signature
 *    R.uncapitalize(string)
 * @example
 *    R.uncapitalize(`IPhone`) // => `iPhone`
 * @dataLast
 * @category String
 * @strict
 */
export const uncapitalize = <T extends string>(string: T): Uncapitalize<T> =>
  `${string[0]?.toLowerCase() ?? ""}${string.slice(1)}` as Uncapitalize<T>;
