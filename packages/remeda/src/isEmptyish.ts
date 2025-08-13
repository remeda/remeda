import type { And, IsEqual, Tagged } from "type-fest";
import type { IsBoundedRecord } from "./internal/types/IsBoundedRecord";
import type { NarrowedTo } from "./internal/types/NarrowedTo";
import type { TupleParts } from "./internal/types/TupleParts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for emptyish
declare const EMPTYISH_BRAND: unique symbol;

type Empty<T> = Tagged<T, typeof EMPTYISH_BRAND>;

type Emptyish<T> =
  | (T extends string ? "" : never)
  | (T extends object ? EmptyishObjectLike<Extract<T, object>> : never)
  | (T extends null ? null : never)
  | (T extends undefined ? undefined : never);

type EmptyishObjectLike<T> =
  T extends ReadonlyArray<unknown>
    ? EmptyishArray<T>
    : T extends ReadonlySet<unknown>
      ? T extends Set<unknown>
        ? Empty<T>
        : ReadonlySet<never>
      : EmptyishObject<T>;

type EmptyishArray<T extends ReadonlyArray<unknown>> = T extends readonly []
  ? T
  : And<
        IsEqual<TupleParts<T>["required"], []>,
        IsEqual<TupleParts<T>["suffix"], []>
      > extends true
    ? T extends Array<unknown>
      ? Empty<T>
      : readonly []
    : never;

type EmptyishObject<T> = T extends { length: number }
  ? T extends string
    ? never
    : Empty<T>
  : IsBoundedRecord<T> extends true
    ? Partial<T> extends T
      ? { readonly [P in keyof T]: never }
      : never
    : { readonly [P in keyof T]: never };

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
 *    R.isEmptyish({ length: 0 }) //=> true
 * @category Guard
 */
export function isEmptyish<T>(
  data: T | Readonly<Emptyish<T>>,
): data is T extends unknown ? NarrowedTo<T, Emptyish<T>> : never {
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
