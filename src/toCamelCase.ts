import type { CamelCase } from "type-fest";
import { words } from "./internal/words";

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
 * `uncapitalize`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param data - A string.
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase(data);
 *   R.toCamelCase(data, { preserveConsecutiveUppercase });
 * @example
 *   R.toCamelCase("hello world"); // "helloWorld"
 *   R.toCamelCase("__HELLO_WORLD__"); // "helloWorld"
 *   R.toCamelCase("HasHtml"); // "hasHTML"
 *   R.toCamelCase("HasHtml", { preserveConsecutiveUppercase: false }); // "hasHtml"
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
 * `uncapitalize`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase()(data);
 *   R.toCamelCase({ preserveConsecutiveUppercase })(data);
 * @example
 *   R.pipe("hello world", R.toCamelCase()); // "helloWorld"
 *   R.pipe("__HELLO_WORLD__", toCamelCase()); // "helloWorld"
 *   R.pipe("HasHtml", R.toCamelCase()); // "hasHTML"
 *   R.pipe(
 *     "HasHtml",
 *     R.toCamelCase({ preserveConsecutiveUppercase: false }),
 *   ); // "hasHtml"
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
  words(
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
