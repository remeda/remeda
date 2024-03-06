import type { NarrowedTo } from "./_types";

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly.
 * @param data - The variable to check.
 * @signature
 *    R.isSymbol(data)
 * @returns True if the passed input is a symbol, false otherwise.
 * @example
 *    R.isSymbol(Symbol('foo')) //=> true
 *    R.isSymbol(1) //=> false
 * @category Guard
 */
export function isSymbol<T>(data: T | symbol): data is NarrowedTo<T, symbol> {
  return typeof data === "symbol";
}
