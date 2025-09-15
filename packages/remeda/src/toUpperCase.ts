import { purry } from "./purry";

/**
 * Replaces all lowercase characters with their uppercase equivalents.
 *
 * It uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase),
 * and for display purposes use CSS[`text-transform: uppercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @param data - A string.
 * @signature
 *   R.toUpperCase(data);
 * @example
 *   R.toUpperCase("Hello World"); // "HELLO WORLD"
 * @dataFirst
 * @category String
 */
export function toUpperCase<T extends string>(data: T): Uppercase<T>;

/**
 * Replaces all lowercase characters with their uppercase equivalents.
 *
 * It uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase),
 * and for display purposes use CSS[`text-transform: uppercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @signature
 *   R.toUpperCase()(data);
 * @example
 *   R.pipe("Hello World", R.toUpperCase()); // "HELLO WORLD"
 * @dataLast
 * @category String
 */
export function toUpperCase(): <T extends string>(data: T) => Uppercase<T>;

export function toUpperCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toUpperCaseImplementation, args);
}

const toUpperCaseImplementation = <T extends string>(data: T): Uppercase<T> =>
  data.toUpperCase() as Uppercase<T>;
