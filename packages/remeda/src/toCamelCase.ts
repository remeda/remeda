import type { CamelCase } from "type-fest";
import type { OptionalOptionsWithDefaults } from "./internal/types/OptionalOptionsWithDefaults";
import { words } from "./internal/words";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;

const DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE = true;

type CamelCaseOptions = {
  readonly preserveConsecutiveUppercase?: boolean;
};

type CamelCaseOptionsWithDefaults<Options extends CamelCaseOptions> =
  OptionalOptionsWithDefaults<
    CamelCaseOptions,
    Options,
    {
      // We use the runtime const for the default type so they stay coupled.
      preserveConsecutiveUppercase: typeof DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE;
    }
  >;

/**
 * Converts text to **camelCase** by splitting it into words, lowercasing the
 * first word, capitalizing the rest, then joining them back together.
 *
 * Because it uses the built-in case conversion methods, the function shares
 * their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
 * too, making it best suited for simple strings like identifiers and internal
 * keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
 * with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters),
 * [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * and [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)
 * which are purpose-built to handle nuances in languages and locales.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toKebabCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param data - A string.
 * @param options - An _optional_ object with the _optional_ property
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase(data);
 *   R.toCamelCase(data, { preserveConsecutiveUppercase });
 * @example
 *   R.toCamelCase("hello world"); // "helloWorld"
 *   R.toCamelCase("__HELLO_WORLD__"); // "helloWorld"
 *   R.toCamelCase("HasHTML"); // "hasHTML"
 *   R.toCamelCase("HasHTML", { preserveConsecutiveUppercase: false }); // "hasHtml"
 * @dataFirst
 * @category String
 */
export function toCamelCase<T extends string, Options extends CamelCaseOptions>(
  data: T,
  options?: Options,
): CamelCase<T, CamelCaseOptionsWithDefaults<Options>>;

/**
 * Converts text to **camelCase** by splitting it into words, lowercasing the
 * first word, capitalizing the rest, then joining them back together.
 *
 * Because it uses the built-in case conversion methods, the function shares
 * their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
 * too, making it best suited for simple strings like identifiers and internal
 * keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
 * with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters),
 * [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * and [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)
 * which are purpose-built to handle nuances in languages and locales.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toKebabCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param options - An _optional_ object with the _optional_ property
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase()(data);
 *   R.toCamelCase({ preserveConsecutiveUppercase })(data);
 * @example
 *   R.pipe("hello world", R.toCamelCase()); // "helloWorld"
 *   R.pipe("__HELLO_WORLD__", R.toCamelCase()); // "helloWorld"
 *   R.pipe("HasHTML", R.toCamelCase()); // "hasHTML"
 *   R.pipe(
 *     "HasHTML",
 *     R.toCamelCase({ preserveConsecutiveUppercase: false }),
 *   ); // "hasHtml"
 * @dataLast
 * @category String
 */
export function toCamelCase<Options extends CamelCaseOptions>(
  options?: Options,
): <T extends string>(
  data: T,
) => CamelCase<T, CamelCaseOptionsWithDefaults<Options>>;

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
    preserveConsecutiveUppercase = DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE,
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
          // The first word is uncapitalized, the rest are capitalized
          index === 0 ? word[0]!.toLowerCase() : word[0]!.toUpperCase()
        }${preserveConsecutiveUppercase ? word.slice(1) : word.slice(1).toLowerCase()}`,
    )
    .join("");
