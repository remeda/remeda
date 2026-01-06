import { purry } from "./purry";

/**
 * Makes the first character of a string uppercase while leaving the rest
 * unchanged.
 *
 * It uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
 * just the first letter of the word, and [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase)
 * to capitalize it. This transformation **is** locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @param data - A string.
 * @signature
 *   R.capitalize(data);
 * @example
 *   R.capitalize("hello world"); // "Hello world"
 * @dataFirst
 * @category String
 */
export function capitalize<T extends string>(data: T): Capitalize<T>;

/**
 * Makes the first character of a string uppercase while leaving the rest
 * unchanged.
 *
 * It uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
 * just the first letter of the word, and [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase)
 * to capitalize it. This transformation **is** locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @signature
 *   R.capitalize()(data);
 * @example
 *   R.pipe("hello world", R.capitalize()); // "Hello world"
 * @dataLast
 * @category String
 */
export function capitalize(): <T extends string>(data: T) => Capitalize<T>;

export function capitalize(...args: readonly unknown[]): unknown {
  return purry(capitalizeImplementation, args);
}

const capitalizeImplementation = <T extends string>(data: T): Capitalize<T> =>
  `${data[0]?.toUpperCase() ?? ""}${data.slice(1)}` as Capitalize<T>;
