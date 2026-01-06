import { purry } from "./purry";

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
 *   R.startsWith(data, prefix);
 * @example
 *   R.startsWith("hello world", "hello"); // true
 *   R.startsWith("hello world", "world"); // false
 * @dataFirst
 * @category String
 */
export function startsWith<T extends string, Prefix extends string>(
  data: T,
  prefix: string extends Prefix ? never : Prefix,
): data is T & `${Prefix}${string}`;
export function startsWith(data: string, prefix: string): boolean;

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
 *   R.startsWith(prefix)(data);
 * @example
 *   R.pipe("hello world", R.startsWith("hello")); // true
 *   R.pipe("hello world", R.startsWith("world")); // false
 * @dataLast
 * @category String
 */
export function startsWith<Prefix extends string>(
  prefix: string extends Prefix ? never : Prefix,
): <T extends string>(data: T) => data is T & `${Prefix}${string}`;
export function startsWith(prefix: string): (data: string) => boolean;

export function startsWith(...args: readonly unknown[]): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
