//#region src/toLowerCase.d.ts
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
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @param data - A string.
 * @signature
 *   R.toLowerCase(data);
 * @example
 *   R.toLowerCase("Hello World"); // "hello world"
 * @dataFirst
 * @category String
 */
declare function toLowerCase<T extends string>(data: T): Lowercase<T>;
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
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @signature
 *   R.toLowerCase()(data);
 * @example
 *   R.pipe("Hello World", R.toLowerCase()); // "hello world"
 * @dataLast
 * @category String
 */
declare function toLowerCase(): <T extends string>(data: T) => Lowercase<T>;
//#endregion
export { toLowerCase as t };
//# sourceMappingURL=toLowerCase-Densm2Y9.d.cts.map