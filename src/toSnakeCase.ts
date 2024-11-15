import type { Join, Words } from "type-fest";
import { words } from "./internal/words";
import { purry } from "./purry";

type SnakeCase<S extends string> = string extends S
  ? string
  : Lowercase<Join<Words<S>, "_">>;

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
export function toSnakeCase<S extends string>(data: S): SnakeCase<S>;

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
export function toSnakeCase(): <S extends string>(data: S) => SnakeCase<S>;

export function toSnakeCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toSnakeCaseImplementation, args);
}

const toSnakeCaseImplementation = <S extends string>(data: S): SnakeCase<S> =>
  // @ts-expect-error [ts2322] -- To avoid importing our own utilities for this
  // we are using the built-in `join` and `toLowerCase` functions which aren't
  // typed as well. This is equivalent to `toLowerCase(join(words(data), "_"))`
  // which TypeScript infers correctly as KebabCase.
  words(data).join("_").toLowerCase();
