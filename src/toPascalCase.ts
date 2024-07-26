import { type PascalCase } from "type-fest";
import { splitWords } from "./internal/splitWords";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;

type PascalCaseOptions = {
  readonly preserveConsecutiveUppercase?: boolean;
};

const DEFAULT_OPTIONS = {
  // Same as type-fest's default.
  preserveConsecutiveUppercase: true,
} as const satisfies PascalCaseOptions;

/**
 * Convert a text to PascalCase by splitting it into words, capitalizing the
 * words, then joining them back together. This is the runtime implementation of
 * type-fest's [`PascalCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * @param data - A string.
 * @param options - Used to disable the default behavior of preserving
 * consecutive uppercase characters. This is optional.
 * @signature
 *   R.toPascalCase(data);
 * @example
 *   R.toPascalCase("hello world"); // "HelloWorld"
 * @dataFirst
 * @category String
 */
export function toPascalCase<
  T extends string,
  Options extends PascalCaseOptions = typeof DEFAULT_OPTIONS,
>(data: T, options?: Options): PascalCase<T, Options>;

/**
 * Convert a text to PascalCase by splitting it into words, capitalizing the
 * words, then joining them back together. This is the runtime implementation of
 * type-fest's [`PascalCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * @param options - Used to disable the default behavior of preserving
 * consecutive uppercase characters. This is optional.
 * @signature
 *   R.toPascalCase()(data);
 * @example
 *   R.pipe("hello world", R.toPascalCase()); // "HelloWorld"
 * @dataLast
 * @category String
 */
export function toPascalCase<
  Options extends PascalCaseOptions = typeof DEFAULT_OPTIONS,
>(options?: Options): <T extends string>(data: T) => PascalCase<T, Options>;

export function toPascalCase(
  dataOrOptions: PascalCaseOptions | string,
  options?: PascalCaseOptions,
): unknown {
  return typeof dataOrOptions === "string"
    ? toPascalCaseImplementation(dataOrOptions, options)
    : (data: string) => toPascalCaseImplementation(data, dataOrOptions);
}

// Based on the type definition from type-fest.
// @see https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts#L76-L80
const toPascalCaseImplementation = (
  data: string,
  {
    preserveConsecutiveUppercase = DEFAULT_OPTIONS.preserveConsecutiveUppercase,
  }: PascalCaseOptions = {},
): string =>
  splitWords(
    LOWER_CASE_CHARACTER_RE.test(data)
      ? data
      : // If the text doesn't have **any** lower case characters we also lower
        // case everything, but if it does we need to maintain them as it
        // affects the word boundaries.
        data.toLowerCase(),
  )
    .map(
      (word) =>
        `${word[0]?.toUpperCase() ?? ""}${preserveConsecutiveUppercase ? word.slice(1) : word.slice(1).toLowerCase()}`,
    )
    .join("");
