import type { IsEqual, IsLiteral, Join, Merge, Words } from "type-fest";
import { words } from "./internal/words";

const LOWER_CASE_CHARACTER_RE = /[a-z]/u;
const DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE = true;

type TitleCaseOptions = {
  readonly preserveConsecutiveUppercase?: boolean;
};

type TitleCaseOptionsWithDefaults<Options extends TitleCaseOptions> = Merge<
  {
    // We use the runtime const for the default type so they stay coupled.
    preserveConsecutiveUppercase: typeof DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE;
  },
  {
    [Key in keyof Options as Extract<Options[Key], undefined> extends never
      ? Key
      : never]: Options[Key];
  }
> &
  Required<TitleCaseOptions>;

type TitleCase<S extends string, Options extends TitleCaseOptions> =
  IsLiteral<S> extends true
    ? Join<
        TitleCasedArray<
          Words<IsEqual<S, Uppercase<S>> extends true ? Lowercase<S> : S>,
          TitleCaseOptionsWithDefaults<Options>
        >,
        " "
      >
    : string;

type TitleCasedArray<
  T extends ReadonlyArray<string>,
  Options extends TitleCaseOptions,
> = {
  [I in keyof T]: Capitalize<
    Options["preserveConsecutiveUppercase"] extends true
      ? T[I]
      : Lowercase<T[I]>
  >;
};

/**
 * Converts text to **Title Case** by splitting it into words, capitalizing the
 * first letter of each word, then joining them back together with spaces.
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
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @param data - A string.
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toTitleCase(data);
 *   R.toTitleCase(data, { preserveConsecutiveUppercase });
 * @example
 *   R.toTitleCase("hello world"); // "Hello World"
 *   R.toTitleCase("--foo-bar--"); // "Foo Bar"
 *   R.toTitleCase("fooBar"); // "Foo Bar"
 *   R.toTitleCase("__FOO_BAR__"); // "Foo Bar"
 *   R.toTitleCase("XMLHttpRequest"); // "XML Http Request"
 *   R.toTitleCase("XMLHttpRequest", { preserveConsecutiveUppercase: false }); // "Xml Http Request"
 * @dataFirst
 * @category String
 */
export function toTitleCase<S extends string, Options extends TitleCaseOptions>(
  data: S,
  options?: Options,
): TitleCase<S, Options>;

/**
 * Converts text to **Title Case** by splitting it into words, capitalizing the
 * first letter of each word, then joining them back together with spaces.
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
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toTitleCase()(data);
 *   R.toTitleCase({ preserveConsecutiveUppercase })(data);
 * @example
 *   R.pipe("hello world", R.toTitleCase()); // "Hello World"
 *   R.pipe("--foo-bar--", R.toTitleCase()); // "Foo Bar"
 *   R.pipe("fooBar", R.toTitleCase()); // "Foo Bar"
 *   R.pipe("__FOO_BAR__", R.toTitleCase()); // "Foo Bar"
 *   R.pipe("XMLHttpRequest", R.toTitleCase()); // "XML Http Request"
 *   R.pipe(
 *     "XMLHttpRequest",
 *     R.toTitleCase({ preserveConsecutiveUppercase: false }),
 *   ); // "Xml Http Request"
 * @dataLast
 * @category String
 */
export function toTitleCase<Options extends TitleCaseOptions>(
  options?: Options,
): <S extends string>(data: S) => TitleCase<S, Options>;

export function toTitleCase(
  dataOrOptions?: TitleCaseOptions | string,
  options?: TitleCaseOptions,
): unknown {
  return typeof dataOrOptions === "string"
    ? toTitleCaseImplementation(dataOrOptions, options)
    : (data: string) => toTitleCaseImplementation(data, dataOrOptions);
}

// Similar to the implementation used in toCamelCase
const toTitleCaseImplementation = (
  data: string,
  {
    preserveConsecutiveUppercase = DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE,
  }: TitleCaseOptions = {},
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
      (word) =>
        `${word[0]?.toUpperCase() ?? ""}${
          preserveConsecutiveUppercase
            ? word.slice(1)
            : word.slice(1).toLowerCase()
        }`,
    )
    .join(" ");
