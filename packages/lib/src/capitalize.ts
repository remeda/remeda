import { purry } from "./purry";

/**
 * Makes first character of a string upper-case. Uses the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: capitalize;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
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
 * Makes first character of a string upper-case. Uses the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: capitalize;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @signature
 *   R.capitalize()(data);
 * @example
 *   R.pipe("hello world", R.capitalize()); // "Hello world"
 * @dataLast
 * @category String
 */
export function capitalize(): <T extends string>(data: T) => Capitalize<T>;

export function capitalize(...args: ReadonlyArray<unknown>): unknown {
  return purry(capitalizeImplementation, args);
}

const capitalizeImplementation = <T extends string>(data: T): Capitalize<T> =>
  `${data[0]?.toUpperCase() ?? ""}${data.slice(1)}` as Capitalize<T>;
