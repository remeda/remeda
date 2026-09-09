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
// check for unions). The only limitation is for unbounded template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type EndsWith<T, Suffix extends string> = T & `${string}${Suffix}`;

/**
 * When a literal suffix doesn't match *any* of the possible values of the input
 * the call itself is rejected by disabling it's return type. If this overload
 * signature was chosen for your call most likely your suffix has a typo or the
 * data itself has changed and it no longer satisfies the `suffix`.
 *
 * @param data - The input string.
 * @param suffix - The string to check for at the end.
 * @example
 *   endsWith("cat" as ("cat" | "dog"), "bird"); //=> void
 * @hidden
 */
export function endsWith<T extends string, Suffix extends string>(
  data: T,
  // This signature has to come first so that TypeScript would pick it only
  // when it would result in narrowing to `never`; by returning void the
  // signature effectively "disables" the usefulness of the function, in most
  // cases surfacing a compile-time error, allowing users to detect typos or
  // dead code at the call site itself instead of relying on downstream errors.
  // @see https://github.com/remeda/remeda/issues/1432
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? Suffix : never,
): void;

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
 *   endsWith("hello world", "world"); //=> true
 *   endsWith("hello world" as string, "hello"); //=> false
 * @dataFirst
 * @category String
 */
export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: IsPrimitiveString<Suffix> extends true ? never : Suffix,
): data is EndsWith<T, Suffix>;

export function endsWith(data: string, suffix: string): boolean;

/**
 * When a literal suffix doesn't match *any* of the possible values of the input
 * the call itself is rejected by disabling it's return type. If this overload
 * signature was chosen for your call most likely your suffix has a typo or the
 * data itself has changed and it no longer satisfies the `suffix`.
 *
 * @param suffix - The string to check for at the end.
 * @example
 *   pipe("cat" as ("cat" | "dog"), endsWith("bird")); //=> void
 * @hidden
 */
export function endsWith<T extends string, Suffix extends string>(
  // This signature has to come first so that TypeScript would pick it only
  // when it would result in narrowing to `never`; by returning void the
  // signature effectively "disables" the usefulness of the function, in most
  // cases surfacing a compile-time error, allowing users to detect typos or
  // dead code at the call site itself instead of relying on downstream errors.
  // @see https://github.com/remeda/remeda/issues/1432
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? Suffix : never,
): (data: T) => void;

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
 *   pipe("hello world", endsWith("world")); //=> true
 *   pipe("hello world", endsWith("hello")); //=> false
 * @dataLast
 * @category String
 */
export function endsWith<Suffix extends string>(
  suffix: IsPrimitiveString<Suffix> extends true ? never : Suffix,
): <T extends string>(data: T) => data is EndsWith<T, Suffix>;

export function endsWith(suffix: string): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
