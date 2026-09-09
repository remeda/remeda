/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type { IsNever } from "type-fest";
import type { IsPrimitiveString } from "./internal/types/IsPrimitiveString";
import { purry } from "./purry";

// By intersecting with a prefix template we force all types that satisfy this
// type to also be of this shape. For a raw primitive string this narrows
// exactly to the prefix template, for a literal TypeScript check if it
// satisfies the condition and narrow to `never` if not (and distribute the
// check for unions). The only limitation is for unbounded template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type StartsWith<T, Prefix extends string> = T & `${Prefix}${string}`;

/**
 * **IMPORTANT**: When a literal prefix doesn't match *any* of the possible
 * values of `data` the call itself is rejected by disabling it's return type.
 * If this overload signature was chosen for your call most likely your prefix
 * has a typo or `data` itself has changed and it no longer satisfies the
 * `prefix`.
 *
 * If you still need to make the check on these values widen one of them to
 * `string`.
 *
 * @param data - The input string.
 * @param prefix - The string to check for at the end.
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
  prefix: IsPrimitiveString<Prefix> extends true ? never : Prefix,
): data is StartsWith<T, Prefix>;

export function startsWith(data: string, prefix: string): boolean;

/**
 * **IMPORTANT**: When a literal prefix doesn't match *any* of the possible
 * values of `data` the call itself is rejected by disabling it's return type.
 * If this overload signature was chosen for your call most likely your prefix
 * has a typo or `data` itself has changed and it no longer satisfies the
 * `prefix`.
 *
 * If you still need to make the check on these values widen one of them to
 * `string`.
 *
 * @param prefix - The string to check for at the end.
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
  prefix: IsPrimitiveString<Prefix> extends true ? never : Prefix,
): <T extends string>(data: T) => data is StartsWith<T, Prefix>;

export function startsWith(prefix: string): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
