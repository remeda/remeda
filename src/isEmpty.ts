import type { IterableContainer } from "./internal/types";

/**
 * A function that checks if the passed parameter is empty.
 *
 * `undefined` is also considered empty, but only when it's in a union with a
 * `string` or string-like type.
 *
 * This guard doesn't work negated because of typescript limitations! If you
 * need to check that an array is *not* empty, use `R.hasAtLeast(data, 1)`
 * and not `!R.isEmpty(data)`. For strings and objects there's no way in
 * typescript to narrow the result to a non-empty type.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is empty, false otherwise.
 * @signature
 *    R.isEmpty(data)
 * @example
 *    R.isEmpty(undefined) //=>true
 *    R.isEmpty('') //=> true
 *    R.isEmpty([]) //=> true
 *    R.isEmpty({}) //=> true
 *    R.isEmpty('test') //=> false
 *    R.isEmpty([1, 2, 3]) //=> false
 *    R.isEmpty({ length: 0 }) //=> false
 * @category Guard
 */
export function isEmpty<T extends string | undefined>(
  data: T,
): data is
  | ("" extends T ? "" : never)
  | (undefined extends T ? undefined : never);
export function isEmpty(data: IterableContainer): data is [];
export function isEmpty<T extends object>(
  data: T,
): data is Record<keyof T, never>;

export function isEmpty(data: object | string | undefined): boolean {
  if (data === undefined) {
    return true;
  }

  if (typeof data === "string") {
    return data.length === 0;
  }

  if (Array.isArray(data)) {
    return data.length === 0;
  }

  return Object.keys(data).length === 0;
}
