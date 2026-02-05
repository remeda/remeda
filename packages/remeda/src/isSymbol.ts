import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a symbol, false otherwise.
 * @signature
 *    isSymbol(data)
 * @example
 *    isSymbol(Symbol('foo')) //=> true
 *    isSymbol(1) //=> false
 * @category Guard
 */
export function isSymbol<T>(data: T | symbol): data is NarrowedTo<T, symbol> {
  return typeof data === "symbol";
}
