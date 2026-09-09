/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type {
  IsEqual,
  IsNever,
  IsStringLiteral,
  UnionToIntersection,
} from "type-fest";
import type { Boxed } from "./internal/types/Boxed";
import { purry } from "./purry";

// By intersecting with a prefix template we force all types that satisfy this
// type to also be of this shape. For a raw primitive string this narrows
// exactly to the prefix template, for a literal TypeScript check if it
// satisfies the condition and narrow to `never` if not (and distribute the
// check for unions). The only limitation is for unbounded template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type StartsWith<T, Prefix extends string> = T & `${Prefix}${string}`;

// The same intersection, but requiring *every* possible runtime value of the
// prefix instead of any of them. Only one of them is the prefix at runtime, and
// which one is unknowable, so a failed check can only rule out values that
// would have matched no matter which one it was.
type StartsWithEvery<T, Prefix extends string> = T &
  // 4. And then we intersect the prefixes instead of adding them to a union to
  // flip the semantics from "OR" to "AND", so that the resulting prefix
  // limitation is the tightest possible combination of all prefixes, and not
  // the widest one, before unwrapping the box.
  Boxed.Extract<
    UnionToIntersection<
      // 1. We first distribute the union to compute the prefix for each member
      // of the union separately (otherwise the prefix itself would contain
      // the union).
      Prefix extends unknown
        ? // 3. Each prefix is boxed so that it survives as a distinct union
          // member until the intersection. Unboxed, a `never` would vanish from
          // the union instead of emptying the intersection, and an empty
          // prefix's `string` would absorb its siblings via subtype reduction.
          Boxed<
            // 2. Unbounded template strings represent infinite possible
            // prefixes, which is exactly the kind of uncertainty that we are
            // working to resolve here, only literals are workable here.
            IsStringLiteral<Prefix> extends true ? `${Prefix}${string}` : never
          >
        : never
    >
  >;

// TypeScript treats type-guards as complementary (e.g., everything either
// fully satisfies the type, or fully doesn't, typing the falsy branch similar
// to the result of `Extract<T, Condition>`). `startsWith` doesn't have this
// relationship when `Prefix` is a union because we don't **know** which of the
// union members match, so we can't narrow the falsy branch at all. The only way
// to prevent this is to prevent TypeScript from using the narrowing overload
// in cases where we know the narrowing wouldn't be sound.
type IsNarrowingUnsound<T, Prefix extends string> = IsEqual<
  // We simulate the falsy branch using the actual narrowing type we use and
  // the type created by narrowing via *all* union members together.
  IsEqual<
    Exclude<T, StartsWith<T, Prefix>>,
    Exclude<T, StartsWithEvery<T, Prefix>>
  >,
  // We want to find the cases where they don't agree, this means that narrowing
  // would result in an unsound overly-narrow falsy branch.
  false
>;

/**
 * **IMPORTANT**: When a literal prefix doesn't match *any* of the possible
 * values of `data` the call itself is rejected by disabling its return type.
 * If this overload signature was chosen for your call most likely your prefix
 * has a typo or `data` itself has changed and it no longer satisfies the
 * `prefix`.
 *
 * If you still need to make the check on these values widen one of them to
 * `string`.
 *
 * @param data - The input string.
 * @param prefix - The string to check for at the beginning.
 * @example
 *   startsWith("cat" as ("cat" | "dog"), "bird"); //=> void
 *   startsWith("cat" as ("cat" | "dog"), "bird" as string); //=> boolean
 * @hidden
 */
export function startsWith<T extends string, Prefix extends string>(
  data: T,
  // This signature has to come first so that TypeScript would pick it only
  // when it would result in narrowing to `never`; by returning void the
  // signature effectively "disables" the usefulness of the function, in most
  // cases surfacing a compile-time error, allowing users to detect typos or
  // dead code at the call site itself instead of relying on downstream errors.
  // @see https://github.com/remeda/remeda/issues/1432
  prefix: IsNever<StartsWith<T, Prefix>> extends true ? Prefix : never,
): void;

/**
 * Determines whether a string begins with the provided prefix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
 * method, but doesn't expose the `position` parameter. To check from a specific
 * position, use `startsWith(sliceString(data, position), prefix)`.
 *
 * @param data - The input string.
 * @param prefix - The string to check for at the beginning.
 * @signature
 *   startsWith(data, prefix);
 * @example
 *   startsWith("hello world", "hello"); //=> true
 *   startsWith("hello world" as string, "world"); //=> false
 * @dataFirst
 * @category String
 */
export function startsWith<T extends string, Prefix extends string>(
  data: T,
  // Reject primitive strings, they can't be used to narrow T. They would match
  // the non-narrowing overload.
  prefix: string extends Prefix
    ? never
    : // Union prefixes are rejected too when the guard they'd produce isn't
      // sound.
      IsNarrowingUnsound<T, Prefix> extends true
      ? never
      : Prefix,
): data is StartsWith<T, Prefix>;

export function startsWith(data: string, prefix: string): boolean;

/**
 * **IMPORTANT**: When a literal prefix doesn't match *any* of the possible
 * values of `data` the call itself is rejected by disabling its return type.
 * If this overload signature was chosen for your call most likely your prefix
 * has a typo or `data` itself has changed and it no longer satisfies the
 * `prefix`.
 *
 * If you still need to make the check on these values widen one of them to
 * `string`.
 *
 * @param prefix - The string to check for at the beginning.
 * @example
 *   pipe("cat" as ("cat" | "dog"), startsWith("bird")); //=> void
 *   pipe("cat" as ("cat" | "dog"), startsWith("bird" as string)); //=> boolean
 * @hidden
 */
export function startsWith<T extends string, Prefix extends string>(
  // This signature has to come first so that TypeScript would pick it only
  // when it would result in narrowing to `never`; by returning void the
  // signature effectively "disables" the usefulness of the function, in most
  // cases surfacing a compile-time error, allowing users to detect typos or
  // dead code at the call site itself instead of relying on downstream errors.
  // @see https://github.com/remeda/remeda/issues/1432
  prefix: IsNever<StartsWith<T, Prefix>> extends true ? Prefix : never,
): (data: T) => void;

export function startsWith<T extends string, Prefix extends string>(
  // In the narrowing data-last overload we move the type of `data` to the
  // returned callback so that it could defer the inference to the wrapper,
  // allowing it to support complex compositions (e.g., `isNot`); but our
  // soundness check requires the `data` type so it could compare against it.
  // To work around this we need an additional overload that would only match
  // the unsound cases. If the inputs are sound, it wouldn't match and allow us
  // to fall through to the next overload.
  prefix: IsNarrowingUnsound<T, Prefix> extends true ? Prefix : never,
): (data: T) => boolean;

/**
 * Determines whether a string begins with the provided prefix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
 * method, but doesn't expose the `position` parameter. To check from a specific
 * position, use `startsWith(sliceString(data, position), prefix)`.
 *
 * @param prefix - The string to check for at the beginning.
 * @signature
 *   startsWith(prefix)(data);
 * @example
 *   pipe("hello world", startsWith("hello")); //=> true
 *   pipe("hello world", startsWith("world")); //=> false
 * @dataLast
 * @category String
 */
export function startsWith<Prefix extends string>(
  // Reject primitive strings, they can't be used to narrow T. They would match
  // the non-narrowing overload.
  prefix: string extends Prefix ? never : Prefix,
): <T extends string>(data: T) => data is StartsWith<T, Prefix>;

export function startsWith(prefix: string): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
