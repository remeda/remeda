import type { SplitWords } from "type-fest/source/split-words";
import { splitWords } from "./internal/splitWords";
import { purry } from "./purry";
import type { Join } from "type-fest";

type KebabCase<T extends string> = string extends T
  ? string
  : Lowercase<Join<SplitWords<T>, "-">>;

/**
 * Convert a text to kebab-Case by splitting it into words and joining them back
 * together with "-", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @param data - A string.
 * @signature
 *   R.toKebabCase(data);
 * @example
 *   R.toKebabCase("hello world"); // "hello-world"
 *   R.toKebabCase("__HELLO_WORLD__"); // "hello-world"
 * @dataFirst
 * @category String
 */
export function toKebabCase<T extends string>(data: T): KebabCase<T>;

/**
 * Convert a text to kebabCase by splitting it into words and joining them back
 * together with "-", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @signature
 *   R.toKebabCase()(data);
 * @example
 *   R.pipe("hello world", R.toKebabCase()); // "hello-world"
 *   R.pipe("__HELLO_WORLD__", toKebabCase()); // "hello-world"
 * @dataLast
 * @category String
 */
export function toKebabCase(): <T extends string>(data: T) => KebabCase<T>;

export function toKebabCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toKebabCaseImplementation, args);
}

const toKebabCaseImplementation = (data: string): string =>
  splitWords(data).join("-").toLowerCase();
