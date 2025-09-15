import { purry } from "./purry";

/**
 * Replaces all uppercase characters with their lowercase equivalents.
 *
 * This function is a wrapper around the built-in
 * [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * and for display purposes use CSS [`text-transform: lowercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @param data - A string.
 * @signature
 *   R.toLowerCase(data);
 * @example
 *   R.toLowerCase("Hello World"); // "hello world"
 * @dataFirst
 * @category String
 */
export function toLowerCase<T extends string>(data: T): Lowercase<T>;

/**
 * Replaces all uppercase characters with their lowercase equivalents.
 *
 * This function is a wrapper around the built-in
 * [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * and for display purposes use CSS [`text-transform: lowercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * @signature
 *   R.toLowerCase()(data);
 * @example
 *   R.pipe("Hello World", R.toLowerCase()); // "hello world"
 * @dataLast
 * @category String
 */
export function toLowerCase(): <T extends string>(data: T) => Lowercase<T>;

export function toLowerCase(...args: ReadonlyArray<unknown>): unknown {
  return purry(toLowerCaseImplementation, args);
}

const toLowerCaseImplementation = <T extends string>(data: T): Lowercase<T> =>
  // @ts-expect-error [ts2322] -- TypeScript can't infer this from the code...
  data.toLowerCase();
