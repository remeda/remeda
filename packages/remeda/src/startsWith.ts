/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type { IsNever } from "type-fest";
import type { IsPrimitiveString } from "./internal/types/IsPrimitiveString";
import { purry } from "./purry";

// By intersecting with a prefix template we force all types that satisfy this
// type to also be of this shape. For a raw primitive string this narrows
// exactly to the suffix template, for a literal TypeScript check if it
// satisfies the condition and narrow to `never` if not (and distribute the
// check for unions). The only limitation is for template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type StartsWith<T, Prefix extends string> = T & `${Prefix}${string}`;

// We want to detect and surface cases where the result of our predicate would
// narrow the data to `never` to prevent trivially dead branches (e.g., to
// detect typos or dead code following renamed literals).
type SatisfiesLiterals<T, Prefix extends string> = string extends Prefix
  ? // This check is only valuable if the prefix itself is a literal, otherwise
    // the narrowing branch would result in `is string` which would cause the
    // falsy branch to be *wrongfully* marked as unreachable.
    never
  : IsNever<StartsWith<T, Prefix>> extends true
    ? // See the comment above for `EndsWith`, the only case where it would
      // resolve to never is a literal that doesn't satisfy the suffix (or a
      // union of such).
      never
    : Prefix;

/**
 * Determines whether a string begins with the provided prefix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
 * method, but doesn't expose the `startPosition` parameter. To check from a
 * specific position, use
 * `startsWith(sliceString(data, startPosition), prefix)`.
 *
 * @param data - The input string.
 * @param prefix - The string to check for at the beginning.
 * @signature
 *   startsWith(data, prefix);
 * @example
 *   startsWith("hello world", "hello"); // true
 *   startsWith("hello world" as string, "world"); // false
 * @dataFirst
 * @category String
 */
export function startsWith<T extends string, Prefix extends string>(
  data: T,
  prefix: SatisfiesLiterals<T, Prefix>,
): data is StartsWith<T, Prefix>;

export function startsWith<Prefix extends string>(
  data: string,
  prefix: IsPrimitiveString<Prefix> extends true ? Prefix : never,
): boolean;

/**
 * Determines whether a string begins with the provided prefix, and refines the
 * output type if possible.
 *
 * This function is a wrapper around the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
 * method, but doesn't expose the `startPosition` parameter. To check from a
 * specific position, use
 * `startsWith(sliceString(data, startPosition), prefix)`.
 *
 * @param prefix - The string to check for at the beginning.
 * @signature
 *   startsWith(prefix)(data);
 * @example
 *   pipe("hello world", startsWith("hello")); // true
 *   pipe("hello world" as string, startsWith("world")); // false
 * @dataLast
 * @category String
 */
export function startsWith<T extends string, Prefix extends string>(
  prefix: SatisfiesLiterals<T, Prefix>,
): (data: T) => data is StartsWith<T, Prefix>;

export function startsWith<Prefix extends string>(
  prefix: IsPrimitiveString<Prefix> extends true ? Prefix : never,
): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
