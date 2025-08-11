import type { NarrowedTo } from "./internal/types/NarrowedTo";

type Emptyish =
  | ""
  | undefined
  | null
  | { readonly length: 0 }
  | Readonly<Record<PropertyKey, never>>;

/**
 * A function that checks if the passed parameter is empty.
 *
 * `undefined` is also considered empty, but only when it's in a union with a
 * `string` or string-like type.
 *
 * This guard doesn't work negated because of typescript limitations! If you
 * need to check that an array is *not* empty, use `R.hasAtLeast(data, 1)`
 * and not `!R.isEmptyish(data)`. For strings and objects there's no way in
 * typescript to narrow the result to a non-empty type.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is empty, false otherwise.
 * @signature
 *    R.isEmptyish(data)
 * @example
 *    R.isEmptyish(undefined) //=>true
 *    R.isEmptyish('') //=> true
 *    R.isEmptyish([]) //=> true
 *    R.isEmptyish({}) //=> true
 *    R.isEmptyish('test') //=> false
 *    R.isEmptyish([1, 2, 3]) //=> false
 *    R.isEmptyish({ length: 0 }) //=> false
 * @category Guard
 */
export function isEmptyish<T>(
  data: T | Emptyish,
): data is NarrowedTo<T, Emptyish> {
  if (data === undefined) {
    return true;
  }

  if (data === null) {
    return true;
  }

  if (data === "") {
    return true;
  }

  if (typeof data !== "object") {
    // There are no non-object types that could be empty at this point...
    return false;
  }

  if ("length" in data && typeof data.length === "number") {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return data.length === 0;
  }

  if ("size" in data && typeof data.size === "number") {
    // Maps and Sets
    return data.size === 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is just how TypeScript types it...
  const proto = Object.getPrototypeOf(data);

  return (
    (proto === Object.prototype || proto === null) &&
    Object.keys(data).length === 0
  );
}
