/* eslint-disable unicorn/consistent-boolean-name --
 * When we mirror a built-in function we use the same name for it.
 */

import type { IsNever } from "type-fest";
import type { IsPrimitiveString } from "./internal/types/IsPrimitiveString";
import { purry } from "./purry";

// The type the data narrows to when the check passes, or `never` when the check
// wouldn't narrow to anything meaningful.
type StartsWith<T, Prefix extends string> = string extends Prefix
  ? // Narrowing is only meaningful when the prefix is a literal, otherwise the
    // type-predicate would narrow to `string` which in turn would cause the
    // falsy branch to be typed as `never` which cause TypeScript to claim
    // wrongfully that is unreachable.
    never
  : // By intersecting with a prefix template we force all types that satisfy
    // this type to also be of this shape. For a raw primitive string this
    // narrows exactly to the prefix template, for a literal TypeScript check if
    // it satisfies the condition and narrow to `never` if not (and distribute
    // the check for unions). The only limitation is for template literals, as
    // TypeScript leaves the intersection as-is, even when they are disjoint.
    T & `${Prefix}${string}`;

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
  // We don't allow TypeScript to pick this signature if it would result in
  // narrowing to `never` so that it would be surfaced as an error instead,
  // allowing the user, at compile time, to detect typos or dead code.
  prefix: IsNever<StartsWith<T, Prefix>> extends true ? never : Prefix,
): data is StartsWith<T, Prefix>;

export function startsWith<Prefix extends string>(
  data: string,
  // The non-narrowing signature is only applicable to primitive strings so
  // that it doesn't accept the literal cases which were rejected by the
  // narrowing signature above.
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
  // We don't allow TypeScript to pick this signature if it would result in
  // narrowing to `never` so that it would be surfaced as an error instead,
  // allowing the user, at compile time, to detect typos or dead code.
  prefix: IsNever<StartsWith<T, Prefix>> extends true ? never : Prefix,
): (data: T) => data is StartsWith<T, Prefix>;

export function startsWith<Prefix extends string>(
  // The non-narrowing signature is only applicable to primitive strings so
  // that it doesn't accept the literal cases which were rejected by  the
  // narrowing overload above.
  prefix: IsPrimitiveString<Prefix> extends true ? Prefix : never,
): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
