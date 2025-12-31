import { t as NarrowedTo } from "./NarrowedTo-BhD0Owsc.cjs";

//#region src/isNullish.d.ts

/**
 * A function that checks if the passed parameter is either `null` or
 * `undefined` and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is either `null` or `undefined`, false
 * otherwise.
 * @signature
 *    R.isNullish(data)
 * @example
 *    R.isNullish(undefined) //=> true
 *    R.isNullish(null) //=> true
 *    R.isNullish('somethingElse') //=> false
 * @category Guard
 */
declare function isNullish<T>(data: T | null | undefined): data is NarrowedTo<T, null | undefined>;
//#endregion
export { isNullish as t };
//# sourceMappingURL=isNullish-Cm4hv93Q.d.cts.map