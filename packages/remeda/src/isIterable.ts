import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is an Iterable and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Iterable, false otherwise.
 * @signature
 *    R.isIterable(data)
 * @example
 *    R.isIterable([5]) //=> true
 *    R.isIterable("a string") //=> true
 *    R.isIterable(5) //=> false
 * @category Guard
 */
export function isIterable<T>(
  data: Iterable<unknown> | T,
): data is NarrowedTo<T, Iterable<unknown>> {
  // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    (typeof data === "object" && data !== null && Symbol.iterator in data) ||
    typeof data === "string"
  );
}
