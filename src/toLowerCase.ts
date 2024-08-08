import { purry } from "./purry";

/**
 * Lowers the case of all characters in the input. Uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Lowercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#lowercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: lowercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
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
 * Lowers the case of all characters in the input. Uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Lowercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#lowercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform" lowercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
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
  data.toLowerCase() as Lowercase<T>;
