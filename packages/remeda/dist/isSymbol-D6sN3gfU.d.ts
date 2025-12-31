import { t as NarrowedTo } from "./NarrowedTo-l7qLJb1r.js";

//#region src/isSymbol.d.ts

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a symbol, false otherwise.
 * @signature
 *    R.isSymbol(data)
 * @example
 *    R.isSymbol(Symbol('foo')) //=> true
 *    R.isSymbol(1) //=> false
 * @category Guard
 */
declare function isSymbol<T>(data: T | symbol): data is NarrowedTo<T, symbol>;
//#endregion
export { isSymbol as t };
//# sourceMappingURL=isSymbol-D6sN3gfU.d.ts.map