import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is a bigint and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    R.isBigInt(data)
 * @example
 *    R.isBigInt(1n); // => true
 *    R.isBigInt(1); // => false
 *    R.isBigInt('notANumber'); // => false
 * @category Guard
 */
export function isBigInt<T>(data: T | bigint): data is NarrowedTo<T, bigint> {
  return typeof data === "bigint";
}
