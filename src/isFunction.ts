/* eslint @typescript-eslint/ban-types: ["error",{types:{Function: false},extendDefaults:true}] --
 * Function is used generically in this file to define any type of function, so
 * this lint error is not relevant for it.
 */
type DefinitelyFunction<T> = Extract<T, Function> extends never
  ? Function
  : Extract<T, Function>;
/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isFunction(data)
 * @returns true if the passed input is a Function, false otherwise
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export function isFunction<T>(
  data: T | Function
): data is DefinitelyFunction<T> {
  return typeof data === 'function';
}
