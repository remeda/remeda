import { purry } from "./purry";

/**
 * Determines whether the starts begins with the provided prefix, and refines
 * the output if possible. Uses the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith).
 *
 * @param data - The input string.
 * @param prefix - The prefix to check for.
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
 * Determines whether the starts begins with the provided prefix, and refines
 * the output if possible. Uses the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith).
 *
 * @param prefix - The prefix to check for.
 * @signature
 *   R.startsWith(data, prefix);
 * @example
 *   R.startsWith("hello world", "hello"); // true
 *   R.startsWith("hello world", "world"); // false
 * @dataLast
 * @category String
 */
export function startsWith<Prefix extends string>(
  prefix: string extends Prefix ? never : Prefix,
): <T extends string>(data: T) => data is T & `${Prefix}${string}`;
export function startsWith(prefix: string): (data: string) => boolean;

export function startsWith(...args: ReadonlyArray<unknown>): unknown {
  return purry(startsWithImplementation, args);
}

const startsWithImplementation = (data: string, prefix: string): boolean =>
  data.startsWith(prefix);
