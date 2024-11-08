import { splitWords } from "./internal/splitWords";
import { purry } from "./purry";

/**
 * Convert a text to snake-case by splitting it into words and joining them back
 * together with "_", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, and `toKebabCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
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
export function toSnakeCase(data: string): string;

/**
 * Convert a text to snake-case by splitting it into words and joining them back
 * together with "_", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, and `toKebabCase`.
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
export function toSnakeCase(): (data: string) => string;

export function toSnakeCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toSnakeCaseImplementation, args);
}

const toSnakeCaseImplementation = (data: string): string =>
  splitWords(data).join("_").toLowerCase();
