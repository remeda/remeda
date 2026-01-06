import { purry } from "./purry";

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
 *   R.endsWith(data, suffix);
 * @example
 *   R.endsWith("hello world", "hello"); // false
 *   R.endsWith("hello world", "world"); // true
 * @dataFirst
 * @category String
 */
export function endsWith<T extends string, Suffix extends string>(
  data: T,
  suffix: string extends Suffix ? never : Suffix,
): data is T & `${string}${Suffix}`;
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
 *   R.endsWith(suffix)(data);
 * @example
 *   R.pipe("hello world", R.endsWith("hello")); // false
 *   R.pipe("hello world", R.endsWith("world")); // true
 * @dataLast
 * @category String
 */
export function endsWith<Suffix extends string>(
  suffix: string extends Suffix ? never : Suffix,
): <T extends string>(data: T) => data is T & `${string}${Suffix}`;
export function endsWith(suffix: string): (data: string) => boolean;

export function endsWith(...args: readonly unknown[]): unknown {
  return purry(endsWithImplementation, args);
}

const endsWithImplementation = (data: string, suffix: string): boolean =>
  data.endsWith(suffix);
