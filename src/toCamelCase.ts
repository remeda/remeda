import { type CamelCase } from "type-fest";
import { splitWords } from "./internal/splitWords";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;

type CamelCaseOptions = {
  readonly preserveConsecutiveUppercase?: boolean;
};

const DEFAULT_OPTIONS = {
  // Same as type-fest's default.
  preserveConsecutiveUppercase: true,
} as const satisfies CamelCaseOptions;

/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toPascalCase`.
 *
 * @param data - A string.
 * @param options - Used to disable the default behavior of preserving
 * consecutive uppercase characters. This is optional.
 * @signature
 *   R.toCamelCase(data);
 * @example
 *   R.toCamelCase("hello world"); // "helloWorld"
 * @dataFirst
 * @category String
 */
export function toCamelCase<
  T extends string,
  Options extends CamelCaseOptions = typeof DEFAULT_OPTIONS,
>(data: T, options?: Options): CamelCase<T, Options>;

/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toPascalCase`.
 *
 * @param options - Used to disable the default behavior of preserving
 * consecutive uppercase characters. This is optional.
 * @signature
 *   R.toCamelCase()(data);
 * @example
 *   R.pipe("hello world", R.toCamelCase()); // "helloWorld"
 * @dataLast
 * @category String
 */
export function toCamelCase<
  Options extends CamelCaseOptions = typeof DEFAULT_OPTIONS,
>(options?: Options): <T extends string>(data: T) => CamelCase<T, Options>;

export function toCamelCase(
  dataOrOptions: CamelCaseOptions | string,
  options?: CamelCaseOptions,
): unknown {
  return typeof dataOrOptions === "string"
    ? toCamelCaseImplementation(dataOrOptions, options)
    : (data: string) => toCamelCaseImplementation(data, dataOrOptions);
}

// Based on the type definition from type-fest.
// @see https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts#L76-L80
const toCamelCaseImplementation = (
  data: string,
  {
    preserveConsecutiveUppercase = DEFAULT_OPTIONS.preserveConsecutiveUppercase,
  }: CamelCaseOptions = {},
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
      (word, index) =>
        `${
          (index === 0
            ? // The first word is uncapitalized, the rest are capitalized
              word[0]?.toLowerCase()
            : word[0]?.toUpperCase()) ?? ""
        }${preserveConsecutiveUppercase ? word.slice(1) : word.slice(1).toLowerCase()}`,
    )
    .join("");
