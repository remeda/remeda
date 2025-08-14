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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- we use a non-exported unique symbol to prevent users from faking our return type.
declare const EMPTYISH_BRAND: unique symbol;

// Because our function is a type-predicate and it narrows the input based on
// the result of our type, we sometimes need a way to "turn off" narrowing while
// still returning the input type. By tagging/branding our return type we stop
// TypeScript from narrowing it while still allowing it to be used as if it was
// the input type (because it still extends the type).
type Empty<T> = Tagged<T, typeof EMPTYISH_BRAND>;

// The goal of this type is to return the empty "view" of the input type. This
// makes it possible for TypeScript to narrow it precisely.
type Emptyish<T> =
  // There are effectively 4 types that can be empty:
  | (T extends string ? "" : never)
  | (T extends object ? EmptyishObjectLike<T> : never)
  | (T extends null ? null : never)
  | (T extends undefined ? undefined : never);

// Because of TypeScript's duck-typing, a lot of sub-types of `object` can
// extend each other so we need to cascade between the different "kinds" of
// objects.
type EmptyishObjectLike<T extends object> =
  T extends ReadonlyArray<unknown>
    ? EmptyishArray<T>
    : T extends ReadonlyMap<infer Key, unknown>
      ? T extends Map<unknown, unknown>
        ? // Mutable maps should remain mutable so we can't narrow them down.
          Empty<T>
        : // But immutable maps could be rewritten to prevent any mutations.
          ReadonlyMap<Key, never>
      : T extends ReadonlySet<unknown>
        ? T extends Set<unknown>
          ? // Mutable sets should remain mutable so we can't narrow them down.
            Empty<T>
          : // But immutable sets could be rewritten to prevent any mutations.
            ReadonlySet<never>
        : EmptyishObject<T>;

type EmptyishArray<T extends ReadonlyArray<unknown>> = T extends readonly []
  ? // By returning T we effectively narrow the "else" branch to `never`.
    T
  : And<
        IsEqual<TupleParts<T>["required"], []>,
        IsEqual<TupleParts<T>["suffix"], []>
      > extends true
    ? T extends Array<unknown>
      ? // A mutable array should remain mutable so we can't narrow it down.
        Empty<T>
      : // But immutable arrays could be rewritten to prevent any mutations.
        readonly []
    : // An array with a required prefix or suffix would never be empty, we can
      // use that fact to narrow the "if" branch to `never`.
      never;

type EmptyishObject<T extends object> = T extends {
  length: infer Length extends number;
}
  ? T extends string
    ? // When a string is tagged/branded it also extends `object` and also has
      // a `length` prop so we need to prevent handling it because it's
      // irrelevant here!
      never
    : // Because of how the implementation works, we need to consider any object
      // with a `length` prop as potentially "empty".
      EmptyishArbitrary<T, Length>
  : T extends { size: infer Size extends number }
    ? // Because of how the implementation works, we need to consider any object
      // with a `size` prop as potentially "empty".
      EmptyishArbitrary<T, Size>
    : IsNever<ValueOf<T>> extends true
      ? // This handles empty objects; by returning T we effectively narrow the
        // "else" branch to `never`.
        T
      : HasRequiredKeys<OmitIndexSignature<T>> extends true
        ? // If the object has required keys it can never be empty, we can use
          // that fact to narrow the "if" branch to `never`.
          never
        : HasWritableKeys<T> extends true
          ? // A mutable object should remain mutable so we can't narrow it
            // down.
            Empty<T>
          : // But immutable objects could be rewritten to prevent any
            // mutations.
            { readonly [P in keyof T]: never };

// We use certain props to check for emptiness effectively, but that means we
// will return those values for any object that has them. Because we don't know
// anything about those objects we need to be careful about narrowing.
type EmptyishArbitrary<T, N> =
  IsNumericLiteral<N> extends true
    ? [0] extends [N]
      ? [N] extends [0]
        ? // If the prop is a literal 0 the object is and always will be empty
          // so we can return it to narrow the "else" branch as `never`.
          T
        : // If it accepts 0, but might accept other values too we need to
          // consider the object mutable and not narrow it down.
          Empty<T>
      : // If the prop will never be 0 we can say it will never be empty and can
        // return `never` for the "if" branch.
        never
    : // If the prop isn't a literal value we don't know enough about the object
      // and should consider it mutable.
      Empty<T>;

// Overly generic types interfere with our already pretty complex return type.
// To make our lives easier we can filter them out at the function declaration
// step and we never need to think about them again.
type ShouldNotNarrow<T> = Or<
  Or<IsAny<T>, IsUnknown<T>>,
  IsEqual<
    T,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {}
  >
>;

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

  // eslint-disable-next-line guard-for-in, no-unreachable-loop -- Instead of taking Object.keys just to check its length, which will be inefficient if the object has a lot of keys, we have a backdoor into an iterator of the object's properties via the `for...in` loop.
  for (const _ in data) {
    return false;
  }

  // We can't do a similar optimization for symbol props, so we leave them for
  // the very last check when the object is practically empty. Assuming that
  // even if an object has a symbol prop, it probably doesn't have thousands of
  // them.
  return Object.getOwnPropertySymbols(data).length === 0;
}
