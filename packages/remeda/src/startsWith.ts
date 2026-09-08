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
// check for unions). The only limitation is for template literals, as
// TypeScript leaves the intersection as-is, even when they are disjoint.
type StartsWith<T, Prefix extends string> = T & `${Prefix}${string}`;

// `true` when no value of `T` could ever start with `Prefix`, which makes the
// check dead code. Intersecting with the prefix template keeps only the part of
// `T` that could match, distributing over unions so that a prefix which misses
// every member reduces to `never`. TypeScript only reduces bounded types this
// way; unbounded template literals (`${string}`, `${number}`) keep the
// intersection unreduced and are never reported (pinned in the known issues).
type IsImpossiblePrefix<T extends string, Prefix extends string> =
  IsPrimitiveString<Prefix> extends true
    ? false
    : IsNever<StartsWith<T, Prefix>>;

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
  prefix: IsImpossiblePrefix<T, Prefix> extends true ? Prefix : never,
): void;

export function startsWith<T extends string, Prefix extends string>(
  data: T,
  prefix: IsPrimitiveString<Prefix> extends true ? never : Prefix,
): data is StartsWith<T, Prefix>;

export function startsWith(data: string, prefix: string): boolean;

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
export function startsWith<T extends string, Prefix extends string>(
  prefix: IsImpossiblePrefix<T, Prefix> extends true ? Prefix : never,
): (data: T) => void;

export function startsWith<Prefix extends string>(
  prefix: IsPrimitiveString<Prefix> extends true ? never : Prefix,
): <T extends string>(data: T) => data is StartsWith<T, Prefix>;

export function startsWith(prefix: string): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
