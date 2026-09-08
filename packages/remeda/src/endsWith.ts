/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type { IsNever } from "type-fest";
import type { IsPrimitiveString } from "./internal/types/IsPrimitiveString";
import { purry } from "./purry";

// The type the data narrows to when the check passes, or `never` when the check
// wouldn't narrow to anything meaningful.
type EndsWith<T, Suffix extends string> = string extends Suffix
  ? // Narrowing is only meaningful when the suffix is a literal, otherwise the
    // type-predicate would narrow to `string` which in turn would cause the
    // falsy branch to be typed as `never` which cause TypeScript to claim
    // wrongfully that is unreachable.
    never
  : // By intersecting with a suffix template we force all types that satisfy
    // this type to also be of this shape. For a raw primitive string this
    // narrows exactly to the suffix template, for a literal TypeScript check if
    // it satisfies the condition and narrow to `never` if not (and distribute
    // the check for unions). The only limitation is for template literals, as
    // TypeScript leaves the intersection as-is, even when they are disjoint.
    T & `${string}${Suffix}`;

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
  // We don't allow TypeScript to pick this signature if it would result in
  // narrowing to `never` so that it would be surfaced as an error instead,
  // allowing the user, at compile time, to detect typos or dead code.
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? never : Suffix,
): data is EndsWith<T, Suffix>;

export function endsWith<Suffix extends string>(
  data: string,
  // The non-narrowing signature is only applicable to primitive strings so
  // that it doesn't accept the literal cases which were rejected by  the
  // narrowing overload above.
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
  // We don't allow TypeScript to pick this signature if it would result in
  // narrowing to `never` so that it would be surfaced as an error instead,
  // allowing the user, at compile time, to detect typos or dead code.
  suffix: IsNever<EndsWith<T, Suffix>> extends true ? never : Suffix,
): (data: T) => data is EndsWith<T, Suffix>;

export function endsWith<Suffix extends string>(
  // The non-narrowing signature is only applicable to primitive strings so
  // that it doesn't accept the literal cases which were rejected by  the
  // narrowing overload above.
  suffix: IsPrimitiveString<Suffix> extends true ? Suffix : never,
): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
