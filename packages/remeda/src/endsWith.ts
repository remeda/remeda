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
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? Suffix : never,
): void;

export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: IsPrimitiveString<Suffix> extends true ? never : Suffix,
): data is EndsWith<T, Suffix>;

export function endsWith(data: string, suffix: string): boolean;

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
export function endsWith<T extends string, Suffix extends string>(
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? Suffix : never,
): (data: T) => void;

export function endsWith<Suffix extends string>(
  suffix: IsPrimitiveString<Suffix> extends true ? never : Suffix,
): <T extends string>(data: T) => data is EndsWith<T, Suffix>;

export function endsWith(suffix: string): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
