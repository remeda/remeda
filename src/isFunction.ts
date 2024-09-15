/* eslint-disable @typescript-eslint/no-unsafe-function-type --
 * Function is used generically in this file to define any type of function, so
 * this lint error is not relevant for it.
 */

type DefinitelyFunction<T> =
  Extract<T, Function> extends never ? Function : Extract<T, Function>;
/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    R.isFunction(data)
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export function isFunction<T>(
  data: Function | T,
): data is DefinitelyFunction<T> {
  return typeof data === "function";
}
