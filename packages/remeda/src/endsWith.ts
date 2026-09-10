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
import type { RemedaTypeError } from "./internal/types/RemedaTypeError";
import { purry } from "./purry";

// By intersecting with a suffix template we force all types that satisfy this
// type to also be of this shape. For a raw primitive string this narrows
// exactly to the suffix template, for a literal TypeScript checks if it
// satisfies the condition and narrow to `never` if not (and distribute the
// check for unions). The only limitation is for unbounded template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type EndsWith<T, Suffix extends string> = T & `${string}${Suffix}`;

type IsDisjointSuffix<
  T extends string,
  Suffix extends string,
> = string extends T
  ? // A primitive string could hold any value at runtime, so a suffix is never
    // provably dead for it. Short-circuiting here also keeps the parameter type
    // resolvable when the suffix itself is generic, which would otherwise
    // leave the conditional deferred and reject the call.
    false
  : IsNever<EndsWith<T, Suffix>>;

type DisjointSuffixError<Suffix extends string> = RemedaTypeError<
  "endsWith",
  "This suffix doesn't match any of the inputs, the function will always return `false`",
  {
    // Tagging `string` (and not the default symbol, or `never`) is what keeps
    // TypeScript from collapsing the type before it prints it, so the message
    // survives into the diagnostic.
    type: string;
    metadata: Suffix;
  }
>;

// The same intersection, but requiring *every* possible runtime value of the
// suffix instead of any of them. Only one of them is the suffix at runtime, and
// which one is unknowable, so a failed check can only rule out values that
// would have matched no matter which one it was.
type EndsWithEvery<T, Suffix extends string> = T &
  // 4. And then we intersect the suffixes instead of adding them to a union to
  // flip the semantics from "OR" to "AND", so that the resulting suffix
  // limitation is the tightest possible combination of all suffixes, and not
  // the widest one, before unwrapping the box.
  Boxed.Extract<
    UnionToIntersection<
      // 1. We first distribute the union to compute the suffix for each member
      // of the union separately (otherwise the suffix itself would contain
      // the union).
      Suffix extends unknown
        ? // 3. Each suffix is boxed so that it survives as a distinct union
          // member until the intersection. Unboxed, a `never` would vanish from
          // the union instead of emptying the intersection, and an empty
          // suffix's `string` would absorb its siblings via subtype reduction.
          Boxed<
            // 2. Unbounded template strings represent infinite possible
            // suffixes, which is exactly the kind of uncertainty that we are
            // working to resolve here, only literals are workable here.
            IsStringLiteral<Suffix> extends true ? `${string}${Suffix}` : never
          >
        : never
    >
  >;

// TypeScript treats type-guards as complementary (e.g., everything either
// fully satisfies the type, or fully doesn't, typing the falsy branch similar
// to the result of `Exclude<T, Condition>`). `endsWith` doesn't have this
// relationship when `Suffix` is a union because we don't **know** which of the
// union members match, so we can't narrow the falsy branch at all. The only way
// to prevent this is to prevent TypeScript from using the narrowing overload
// in cases where we know the narrowing wouldn't be sound.
type IsNarrowingUnsound<T, Suffix extends string> = IsEqual<
  // We simulate the falsy branch using the actual narrowing type we use and
  // the type created by narrowing via *all* union members together.
  IsEqual<
    Exclude<T, EndsWith<T, Suffix>>,
    Exclude<T, EndsWithEvery<T, Suffix>>
  >,
  // We want to find the cases where they don't agree, this means that narrowing
  // would result in an unsound overly-narrow falsy branch.
  false
>;

/**
 * Determines whether a string ends with the provided suffix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
 * method, but doesn't expose the `endPosition` parameter. To check only up to a
 * specific position, use `endsWith(sliceString(data, 0, endPosition), suffix)`.
 *
 * Suffixes that `data` can never end with are rejected at compile-time.
 *
 * @param data - The input string.
 * @param suffix - The string to check for at the end.
 * @signature
 *   endsWith(data, suffix);
 * @example
 *   endsWith("hello world", "world"); //=> true
 *   endsWith("hello world" as string, "hello"); //=> false
 * @dataFirst
 * @category String
 */
export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: string extends Suffix
    ? // Reject primitive strings, they can't be used to narrow T. They would
      // match the non-narrowing overload.
      never
    : IsDisjointSuffix<T, Suffix> extends true
      ? // Both data-first overloads reject a dead suffix so that no overload
        // matches the call at all, which puts the error on the argument
        // itself instead of on whatever consumes the return value.
        // @see https://github.com/remeda/remeda/issues/1432
        DisjointSuffixError<Suffix>
      : IsNarrowingUnsound<T, Suffix> extends true
        ? // Union suffixes are rejected too when the guard they'd produce isn't
          // sound.
          never
        : Suffix,
): data is EndsWith<T, Suffix>;

export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: IsDisjointSuffix<T, Suffix> extends true
    ? DisjointSuffixError<Suffix>
    : Suffix,
): boolean;

/**
 * **IMPORTANT**: When a literal suffix doesn't match *any* of the possible
 * values of `data` the call itself is rejected by disabling its return type.
 * If this overload signature was chosen for your call most likely your suffix
 * has a typo or `data` itself has changed and it no longer satisfies the
 * `suffix`.
 *
 * If you still need to make the check on these values widen one of them to
 * `string`.
 *
 * @param suffix - The string to check for at the end.
 * @example
 *   pipe("cat" as ("cat" | "dog"), endsWith("bird")); //=> void
 *   pipe("cat" as ("cat" | "dog"), endsWith("bird" as string)); //=> boolean
 * @hidden
 */
export function endsWith<T extends string, Suffix extends string>(
  // This signature has to come first so that TypeScript would pick it only
  // when it would result in narrowing to `never`; by returning void the
  // signature effectively "disables" the usefulness of the function, in most
  // cases surfacing a compile-time error, allowing users to detect typos or
  // dead code at the call site itself instead of relying on downstream errors.
  // @see https://github.com/remeda/remeda/issues/1432
  suffix: IsDisjointSuffix<T, Suffix> extends true ? Suffix : never,
): (data: T) => void;

export function endsWith<T extends string, Suffix extends string>(
  // In the narrowing data-last overload we move the type of `data` to the
  // returned callback so that it could defer the inference to the wrapper,
  // allowing it to support complex compositions (e.g., `isNot`); but our
  // soundness check requires the `data` type so it could compare against it.
  // To work around this we need an additional overload that would only match
  // the unsound cases. If the inputs are sound, it wouldn't match and allow us
  // to fall through to the next overload.
  suffix: IsNarrowingUnsound<T, Suffix> extends true ? Suffix : never,
): (data: T) => boolean;

/**
 * Determines whether a string ends with the provided suffix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
 * method, but doesn't expose the `endPosition` parameter. To check only up to a
 * specific position, use `endsWith(sliceString(data, 0, endPosition), suffix)`.
 *
 * Suffixes that `data` can never end with are rejected at compile-time.
 *
 * @param suffix - The string to check for at the end.
 * @signature
 *   endsWith(suffix)(data);
 * @example
 *   pipe("hello world", endsWith("world")); //=> true
 *   pipe("hello world", endsWith("hello")); //=> false
 * @dataLast
 * @category String
 */
export function endsWith<Suffix extends string>(
  // Reject primitive strings, they can't be used to narrow T. They would match
  // the non-narrowing overload.
  suffix: string extends Suffix ? never : Suffix,
): <T extends string>(data: T) => data is EndsWith<T, Suffix>;

export function endsWith(suffix: string): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
