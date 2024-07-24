import { purry } from "./purry";

/**
 * Lowers the case of all characters in the input. Uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Lowercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#lowercasestringtype)
 * utility type for typing.
 *
 * For different casings see: `toUpperCase`, `capitalize`, and `uncapitalize`.
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
 * For different casings see: `toUpperCase`, `capitalize`, and `uncapitalize`.
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
