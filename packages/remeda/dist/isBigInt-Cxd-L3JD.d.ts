import { t as NarrowedTo } from "./NarrowedTo-l7qLJb1r.js";

//#region src/isBigInt.d.ts

/**
 * A function that checks if the passed parameter is a bigint and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    R.isBigInt(data)
 * @example
 *    R.isBigInt(1n); // => true
 *    R.isBigInt(1); // => false
 *    R.isBigInt('notANumber'); // => false
 * @category Guard
 */
declare function isBigInt<T>(data: T | bigint): data is NarrowedTo<T, bigint>;
//#endregion
export { isBigInt as t };
//# sourceMappingURL=isBigInt-Cxd-L3JD.d.ts.map