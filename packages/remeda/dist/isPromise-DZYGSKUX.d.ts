import { t as NarrowedTo } from "./NarrowedTo-l7qLJb1r.js";

//#region src/isPromise.d.ts

/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Promise, false otherwise.
 * @signature
 *    R.isPromise(data)
 * @example
 *    R.isPromise(Promise.resolve(5)) //=> true
 *    R.isPromise(Promise.reject(5)) //=> true
 *    R.isPromise('somethingElse') //=> false
 * @category Guard
 */
declare function isPromise<T>(data: Readonly<PromiseLike<unknown>> | T): data is NarrowedTo<T, PromiseLike<unknown>>;
//#endregion
export { isPromise as t };
//# sourceMappingURL=isPromise-DZYGSKUX.d.ts.map