import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is a number and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    isNumber(data)
 * @example
 *    isNumber(1); // => true
 *    isNumber(1n); // => false
 *    isNumber('notANumber'); // => false
 * @category Guard
 */
export function isNumber<T>(data: T | number): data is NarrowedTo<T, number> {
  return typeof data === "number" && !Number.isNaN(data);
}
