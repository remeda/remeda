import type { Join, Words } from "type-fest";
import { words } from "./internal/words";
import { purry } from "./purry";

type KebabCase<S extends string> = string extends S
  ? string
  : Lowercase<Join<Words<S>, "-">>;

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
export function toKebabCase<S extends string>(data: S): KebabCase<S>;

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
export function toKebabCase(): <S extends string>(data: S) => KebabCase<S>;

export function toKebabCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toKebabCaseImplementation, args);
}

const toKebabCaseImplementation = <S extends string>(data: S): KebabCase<S> =>
  // @ts-expect-error [ts2322] -- To avoid importing our own utilities for this
  // we are using the built-in `join` and `toLowerCase` functions which aren't
  // typed as well. This is equivalent to `toLowerCase(join(words(data), "-"))`
  // which TypeScript infers correctly as KebabCase.
  words(data).join("-").toLowerCase();
