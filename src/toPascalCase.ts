import { type PascalCase } from "type-fest";
import { splitWords } from "./internal/splitWords";
import { purry } from "./purry";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;

/**
 * Convert a text to PascalCase by splitting it into words, capitalizing the
 * words, then joining them back together. This is the runtime implementation of
 * type-fest's [`PascalCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * @param data - A string.
 * @signature
 *   R.toPascalCase(data);
 * @example
 *   R.toPascalCase("hello world"); // "HelloWorld"
 * @dataFirst
 * @category String
 */
export function toPascalCase<T extends string>(data: T): PascalCase<T>;

/**
 * Convert a text to PascalCase by splitting it into words, capitalizing the
 * words, then joining them back together. This is the runtime implementation of
 * type-fest's [`PascalCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * @signature
 *   R.toPascalCase()(data);
 * @example
 *   R.pipe("hello world", R.toPascalCase()); // "HelloWorld"
 * @dataLast
 * @category String
 */
export function toPascalCase(): <T extends string>(data: T) => PascalCase<T>;

export function toPascalCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toPascalCaseImplementation, args);
}

// Based on the type definition from type-fest.
// @see https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts#L76-L80
const toPascalCaseImplementation = <T extends string>(data: T): PascalCase<T> =>
  splitWords(
    LOWER_CASE_CHARACTER_RE.test(data)
      ? data
      : // If the text doesn't have **any** lower case characters we also lower
        // case everything, but if it does we need to maintain them as it
        // affects the word boundaries.
        data.toLowerCase(),
  )
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join("") as PascalCase<T>;
