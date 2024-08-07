import { type SnakeCase } from "type-fest";
import { splitWords } from "./internal/splitWords";

/**
 * Convert a text to snake_case by splitting it into words, un-capitalizing, then joining them back together. This is
 * the runtime implementation of type-fest's [`SnakeCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/snake-case.d.ts).
 *
 * For other case manipulations see: `toCamelCase`, `toLowerCase`, `toUpperCase`, `capitalize`,
 * and `uncapitalize`.
 *
 * @param data - A string.
 * @signature
 *   R.toSnakeCase(data);
 * @example
 *   R.toSnakeCase("hello world"); // "hello_world"
 *   R.toSnakeCase("__HELLO_WORLD__"); // "hello_world"
 * @dataFirst
 * @category String
 */
export function toSnakeCase<T extends string>(data: T): SnakeCase<T>;

/**
 * Convert a text to snake_case by splitting it into words, un-capitalizing, then joining them back together. This is
 * the runtime implementation of type-fest's [`SnakeCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/snake-case.d.ts).
 *
 * For other case manipulations see: `toCamelCase`, `toLowerCase`, `toUpperCase`, `capitalize`,
 * and `uncapitalize`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @signature
 *   R.toSnakeCase()(data);
 * @example
 *   R.pipe("hello world", R.toSnakeCase()); // "hello_world"
 *   R.pipe("__HELLO_WORLD__", toSnakeCase()); // "hello_world"
 * @dataLast
 * @category String
 */
export function toSnakeCase(): <T extends string>(data: T) => SnakeCase<T>;

export function toSnakeCase(optionalData?: string): unknown {
  return typeof optionalData === "string"
    ? toSnakeCaseImplementation(optionalData)
    : (data: string) => toSnakeCaseImplementation(data);
}

const toSnakeCaseImplementation = (data: string): string =>
  splitWords(data).join("_").toLowerCase();
