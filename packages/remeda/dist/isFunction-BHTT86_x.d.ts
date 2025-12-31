import { t as StrictFunction } from "./StrictFunction-COi1SatR.js";
import { t as NarrowedTo } from "./NarrowedTo-l7qLJb1r.js";

//#region src/isFunction.d.ts

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
declare const isFunction: <T>(data: StrictFunction | T) => data is NarrowedTo<T, StrictFunction>;
//#endregion
export { isFunction as t };
//# sourceMappingURL=isFunction-BHTT86_x.d.ts.map