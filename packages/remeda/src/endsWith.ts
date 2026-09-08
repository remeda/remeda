/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type { IsNever } from "type-fest";
import type { IsPrimitiveString } from "./internal/types/IsPrimitiveString";
import { purry } from "./purry";

// By intersecting with a suffix template we force all types that satisfy this
// type to also be of this shape. For a raw primitive string this narrows
// exactly to the suffix template, for a literal TypeScript check if it
// satisfies the condition and narrow to `never` if not (and distribute the
// check for unions). The only limitation is for template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type EndsWith<T, Suffix extends string> = T & `${string}${Suffix}`;

// We want to detect and surface cases where the result of our predicate would
// narrow the data to `never` to prevent trivially dead branches (e.g., to
// detect typos or dead code following renamed literals).
type SatisfiesLiterals<T, Suffix extends string> = string extends Suffix
  ? // This check is only valuable if the suffix itself is a literal, otherwise
    // the narrowing branch would result in `is string` which would cause the
    // falsy branch to be *wrongfully* marked as unreachable.
    never
  : IsNever<EndsWith<T, Suffix>> extends true
    ? // See the comment above for `EndsWith`, the only case where it would
      // resolve to never is a literal that doesn't satisfy the suffix (or a
      // union of such).
      never
    : Suffix;

/**
 * Determines whether a string ends with the provided suffix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
 * method, but doesn't expose the `endPosition` parameter. To check only up to a
 * specific position, use `endsWith(sliceString(data, 0, endPosition), suffix)`.
 *
 * @param data - The input string.
 * @param suffix - The string to check for at the end.
 * @signature
 *   endsWith(data, suffix);
 * @example
 *   endsWith("hello world" as string, "hello"); //=> false
 *   endsWith("hello world", "world"); //=> true
 * @dataFirst
 * @category String
 */
export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: SatisfiesLiterals<T, Suffix>,
): data is EndsWith<T, Suffix>;

export function endsWith<Suffix extends string>(
  data: string,
  suffix: IsPrimitiveString<Suffix> extends true ? Suffix : never,
): boolean;

/**
 * Determines whether a string ends with the provided suffix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
 * method, but doesn't expose the `endPosition` parameter. To check only up to a
 * specific position, use `endsWith(sliceString(data, 0, endPosition), suffix)`.
 *
 * @param suffix - The string to check for at the end.
 * @signature
 *   endsWith(suffix)(data);
 * @example
 *   pipe("hello world" as string, endsWith("hello")); //=> false
 *   pipe("hello world", endsWith("world")); //=> true
 * @dataLast
 * @category String
 */
export function endsWith<T extends string, Suffix extends string>(
  suffix: SatisfiesLiterals<T, Suffix>,
): (data: T) => data is EndsWith<T, Suffix>;

export function endsWith<Suffix extends string>(
  suffix: IsPrimitiveString<Suffix> extends true ? Suffix : never,
): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
