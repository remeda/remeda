import type {
  And,
  HasRequiredKeys,
  IsAny,
  IsEqual,
  IsNever,
  IsNumericLiteral,
  IsUnknown,
  OmitIndexSignature,
  Or,
  Tagged,
  ValueOf,
} from "type-fest";
import type { HasWritableKeys } from "./internal/types/HasWritableKeys";
import type { NoInfer } from "./internal/types/NoInfer";
import type { TupleParts } from "./internal/types/TupleParts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for emptyish
declare const EMPTYISH_BRAND: unique symbol;
type Empty<T> = Tagged<T, typeof EMPTYISH_BRAND>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ShouldNotNarrow<T> = Or<Or<IsAny<T>, IsUnknown<T>>, IsEqual<T, {}>>;

type Emptyish<T> =
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

type EmptyishObject<T extends object> = T extends {
  length: infer Length extends number;
}
  ? T extends string
    ? never
    : EmptyishArbitrary<T, Length>
  : T extends { size: infer Size extends number }
    ? EmptyishArbitrary<T, Size>
    : IsNever<ValueOf<T>> extends true
      ? T
      : HasRequiredKeys<OmitIndexSignature<T>> extends true
        ? never
        : HasWritableKeys<T> extends true
          ? Empty<T>
          : { readonly [P in keyof T]: never };

type EmptyishArbitrary<T, N> =
  IsNumericLiteral<N> extends true
    ? [0] extends [N]
      ? [N] extends [0]
        ? T
        : Empty<T>
      : never
    : Empty<T>;

/**
 * A function that checks if the input is empty. Nullish values (`undefined`
 * and `null`) are also considered empty(-ish). The function supports array-like
 * and object-like types too and thus supports *most* built-in types that have
 * "empty-ish" semantics.
 *
 * This function has *limited* utility at the type level because **negating** it
 * does not yield a useful type in most cases because of TypeScript
 * limitations. Additionally, utilities which accept a narrower input type
 * provide better type-safety on their inputs. In most cases, you should use
 * one of the following functions instead:
 * * `isEmpty` - provides better type-safety on inputs by accepting a narrower set of cases.
 * * `hasAtLeast` - when the input is just an array/tuple.
 * * `isStrictEqual` - when you just need to check for a specific literal value.
 * * `isNullish` - when you just care about `null` and `undefined`.
 * * `isTruthy` - when you need to also filter `number` and `boolean`.
 *
 * @param data - The variable to check.
 * @signature
 *    R.isEmptyish(data)
 * @example
 *    R.isEmptyish(undefined); //=> true
 *    R.isEmptyish(null); //=> true
 *    R.isEmptyish(''); //=> true
 *    R.isEmptyish([]); //=> true
 *    R.isEmptyish({}); //=> true
 *    R.isEmptyish(new Map()); //=> true
 *    R.isEmptyish(new Set()); //=> true
 *
 *    R.isEmptyish('test'); //=> false
 *    R.isEmptyish([1, 2, 3]); //=> false
 *    R.isEmptyish({ a: "hello" }); //=> false
 * @category Guard
 */
export function isEmptyish<T>(
  data: ShouldNotNarrow<T> extends true
    ? never
    : T | Readonly<Emptyish<NoInfer<T>>>,
): data is ShouldNotNarrow<T> extends true
  ? never
  : T extends unknown
    ? Emptyish<NoInfer<T>>
    : never;

export function isEmptyish(data: unknown): boolean;

export function isEmptyish(data: unknown): boolean {
  if (data === undefined || data === null || data === "") {
    // These are the only literal values that are considered emptyish.
    return true;
  }

  if (typeof data !== "object") {
    // There are no non-object types that could be empty at this point...
    return false;
  }

  if ("length" in data && typeof data.length === "number") {
    // Arrays and array-likes.
    return data.length === 0;
  }

  if ("size" in data && typeof data.size === "number") {
    // Maps and Sets.
    return data.size === 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is just how TypeScript types it...
  const proto = Object.getPrototypeOf(data);
  if (proto !== Object.prototype && proto !== null) {
    // For plain objects we are next going to check their actual props in order
    // to assess emptiness, but for any other kind of object we can't rely on
    // any generic logic to detect emptiness correctly (see the tests for all
    // cases this covers).
    return false;
  }

  // eslint-disable-next-line guard-for-in, no-unreachable-loop -- Instead of taking Object.keys just to check it's length, which will be inefficient if the object has a lot of keys, we have a backdoor into an iterator of the object's properties via the `for...in` loop.
  for (const _ in data) {
    return false;
  }

  // We can't do a similar optimization for symbol props, so we leave them for
  // the very last check when the object is practically empty. Assuming that
  // even if an object has a symbol prop, it probably doesn't have thousands of
  // them.
  return Object.getOwnPropertySymbols(data).length === 0;
}
