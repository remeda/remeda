import { purry } from "./purry";

/**
 * Replaces all lower-case characters to their upper-case equivalent in the
 * input. Uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing.
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
 * Replaces all lower-case characters to their upper-case equivalent in the
 * input. Uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing.
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
