import type { IsAny } from "type-fest";

/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Array, false otherwise.
 * @signature
 *    R.isArray(data)
 * @example
 *    R.isArray([5]) //=> true
 *    R.isArray([]) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: ArrayLike<unknown> | T,
): data is Extract<T, ReadonlyArray<unknown>> extends never
  ? T extends Iterable<infer E>
    ? ReadonlyArray<E>
    : ReadonlyArray<unknown>
  : IsAny<T> extends true
    ? ReadonlyArray<unknown>
    : Extract<T, ReadonlyArray<unknown>>;

export function isArray(data: unknown): boolean {
  return Array.isArray(data);
}
