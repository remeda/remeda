import type { NarrowedTo } from "./internal/types/NarrowedTo";
import type { StrictFunction } from "./internal/types/StrictFunction";

/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    R.isFunction(data)
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export const isFunction = <T>(
  data: StrictFunction | T,
): data is NarrowedTo<T, StrictFunction> => typeof data === "function";
