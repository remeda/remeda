import type { Join, Words } from "type-fest";
import { words } from "./internal/words";
import { purry } from "./purry";

type TitleCase<S extends string> = string extends S
  ? string
  : Join<TitleCasedArray<Words<S>>, " ">;

type TitleCasedArray<W extends ReadonlyArray<string>> = {
  [I in keyof W]: Capitalize<Lowercase<W[I]>>;
};

/**
 * Converts text to **Title Case** by splitting it into words, lowercasing
 * them, capitalizing them, then joining them back together with spaces (` `).
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
 * @signature
 *   R.toTitleCase(data);
 * @example
 *   R.toTitleCase("hello world"); // "Hello World"
 *   R.toTitleCase("--foo-bar--"); // "Foo Bar"
 *   R.toTitleCase("fooBar"); // "Foo Bar"
 *   R.toTitleCase("__FOO_BAR__"); // "Foo Bar"
 *   R.toTitleCase("user_id"); // "User Id"
 * @dataFirst
 * @category String
 */
export function toTitleCase<S extends string>(data: S): TitleCase<S>;

export function toTitleCase(): <S extends string>(data: S) => TitleCase<S>;

export function toTitleCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toTitleCaseImplementation, args);
}

const toTitleCaseImplementation = <S extends string>(data: S): TitleCase<S> =>
  // @ts-expect-error [ts2322] -- This is too complex for TypeScript to infer
  // directly via composition, also because the built-in functions don't use the TypeScript utils LowerCase, UpperCase, etc...
  words(data)
    .map(
      (word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
