import { type CamelCase } from "type-fest";
import { splitWords } from "./internal/splitWords";
import { purry } from "./purry";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;

/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toPascalCase`.
 *
 * @param data - A string.
 * @signature
 *   R.toCamelCase(data);
 * @example
 *   R.toCamelCase("hello world"); // "helloWorld"
 * @dataFirst
 * @category String
 */
export function toCamelCase<T extends string>(data: T): CamelCase<T>;

/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toPascalCase`.
 *
 * @signature
 *   R.toCamelCase()(data);
 * @example
 *   R.pipe("hello world", R.toCamelCase()); // "helloWorld"
 * @dataLast
 * @category String
 */
export function toCamelCase(): <T extends string>(data: T) => CamelCase<T>;

export function toCamelCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toCamelCaseImplementation, args);
}

// Based on the type definition from type-fest.
// @see https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts#L76-L80
const toCamelCaseImplementation = <T extends string>(data: T): CamelCase<T> =>
  splitWords(
    LOWER_CASE_CHARACTER_RE.test(data)
      ? data
      : // If the text doesn't have **any** lower case characters we also lower
        // case everything, but if it does we need to maintain them as it
        // affects the word boundaries.
        data.toLowerCase(),
  )
    .map(
      (word, index) =>
        `${
          (index === 0
            ? // The first word is uncapitalized, the rest are capitalized
              word[0]?.toLowerCase()
            : word[0]?.toUpperCase()) ?? ""
        }${word.slice(1)}`,
    )
    .join("") as CamelCase<T>;
