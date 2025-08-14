import type {
  And,
  HasRequiredKeys,
  HasWritableKeys,
  IsEqual,
  IsNever,
  IsUnknown,
  OmitIndexSignature,
  Tagged,
  ValueOf,
} from "type-fest";
import type { NarrowedTo } from "./internal/types/NarrowedTo";
import type { TupleParts } from "./internal/types/TupleParts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for emptyish
declare const EMPTYISH_BRAND: unique symbol;

type Empty<T> = Tagged<T, typeof EMPTYISH_BRAND>;

type Emptyish<T> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  IsEqual<T, {}> extends true
    ? Empty<T>
    : IsUnknown<T> extends true
      ? Empty<T>
      :
          | (T extends string ? "" : never)
          | (T extends object ? EmptyishObjectLike<T> : never)
          | (T extends null ? null : never)
          | (T extends undefined ? undefined : never);

type EmptyishObjectLike<T extends object> =
  T extends ReadonlyArray<unknown>
    ? EmptyishArray<T>
    : T extends ReadonlyMap<infer Key, unknown>
      ? T extends Map<unknown, unknown>
        ? Empty<T>
        : ReadonlyMap<Key, never>
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

type EmptyishObject<T extends object> = T extends { length: number }
  ? T extends string
    ? never
    : Empty<T>
  : IsNever<ValueOf<T>> extends true
    ? T
    : HasRequiredKeys<OmitIndexSignature<T>> extends true
      ? never
      : HasWritableKeys<T> extends true
        ? Empty<T>
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
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  data: T | Emptyish<T>,
): data is T extends unknown ? NarrowedTo<T, Emptyish<T>> : never {
  // eslint-disable-next-line eqeqeq
  if (data == undefined || data === "") {
    return true;
  }

  if (typeof data !== "object") {
    // There are no non-object types that could be empty at this point...
    return false;
  }

  if ("length" in data && typeof data.length === "number") {
    // Arrays
    return data.length === 0;
  }

  if ("size" in data && typeof data.size === "number") {
    // Maps and Sets
    return data.size === 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is just how TypeScript types it...
  const proto = Object.getPrototypeOf(data);
  if (proto !== Object.prototype && proto !== null) {
    return false;
  }

  for (const _key in data) {
    return false;
  }

  return Object.getOwnPropertySymbols(data).length === 0;
}
