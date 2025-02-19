import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is a boolean and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a boolean, false otherwise.
 * @signature
 *    R.isBoolean(data)
 * @example
 *    R.isBoolean(true) //=> true
 *    R.isBoolean(false) //=> true
 *    R.isBoolean('somethingElse') //=> false
 * @category Guard
 */
export function isBoolean<T>(
  data: T | boolean,
): data is NarrowedTo<T, boolean> {
  return typeof data === "boolean";
}
