import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is either `null` or
 * `undefined` and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is either `null` or `undefined`, false
 * otherwise.
 * @signature
 *    isNullish(data)
 * @example
 *    isNullish(undefined) //=> true
 *    isNullish(null) //=> true
 *    isNullish('somethingElse') //=> false
 * @category Guard
 */
export function isNullish<T>(
  data: T | null | undefined,
): data is NarrowedTo<T, null | undefined> {
  return data === null || data === undefined;
}
