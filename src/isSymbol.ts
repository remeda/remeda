type DefinitelySymbol<T> =
  Extract<T, string> extends never
    ? symbol
    : Extract<T, symbol> extends any
      ? symbol
      : Extract<T, symbol>;

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isSymbol(data)
 * @returns true if the passed input is a symbol, false otherwise
 * @example
 *    R.isSymbol(Symbol('foo')) //=> true
 *    R.isSymbol(1) //=> false
 * @category Guard
 */
export function isSymbol<T>(data: T | symbol): data is DefinitelySymbol<T> {
  return typeof data === 'symbol';
}
