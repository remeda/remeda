/**
 * A utility to preserve strings as-is, convert numbers to strings, and fail on
 * anything else. This happens a lot in JS when accessing objects or when
 * enumerating over keys.
 *
 * Notice that symbols are not supported, which is consistent with how built-in
 * functions like `Object.keys` and `Object.entries` behave.
 */
export type ToString<T> = T extends unknown
  ? T extends number
    ? `${T}`
    : T extends string
      ? T
      : never
  : never;
