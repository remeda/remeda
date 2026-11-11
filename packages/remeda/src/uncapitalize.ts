import { purry1 } from "./internal/purryByArity";

/**
 * Makes the first character of a string lowercase while leaving the rest
 * unchanged.
 *
 * It uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime and the built-in [`Uncapitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#Uncapitalizestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.
 *
 * For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
 * just the first letter of the word, and [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase)
 * to lowercase it. This transformation **is** locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`, `capitalize`,
 * `toCamelCase`, `toKebabCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * @param data - A string.
 * @signature
 *   uncapitalize(data);
 * @example
 *   uncapitalize("HELLO WORLD"); // "hELLO WORLD"
 * @dataFirst
 * @category String
 */
export function uncapitalize<T extends string>(data: T): Uncapitalize<T>;

/**
 * Makes the first character of a string lowercase while leaving the rest
 * unchanged.
 *
 * It uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime and the built-in [`Uncapitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#Uncapitalizestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.
 *
 * For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
 * just the first letter of the word, and [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase)
 * to lowercase it. This transformation **is** locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`, `capitalize`,
 * `toCamelCase`, `toKebabCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * @signature
 *   uncapitalize()(data);
 * @example
 *   pipe("HELLO WORLD", uncapitalize()); // "hELLO WORLD"
 * @dataLast
 * @category String
 */
export function uncapitalize(): <T extends string>(data: T) => Uncapitalize<T>;

export function uncapitalize(data?: unknown): unknown {
  return purry1(uncapitalizeImplementation, arguments.length, data);
}

const uncapitalizeImplementation = <T extends string>(
  data: T,
): Uncapitalize<T> =>
  `${data[0]?.toLowerCase() ?? ""}${data.slice(1)}` as Uncapitalize<T>;
