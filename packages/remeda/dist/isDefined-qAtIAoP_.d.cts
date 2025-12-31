//#region src/isDefined.d.ts
/**
 * A function that checks if the passed parameter is defined (`!== undefined`)
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    R.isDefined(data)
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> true
 *    R.isDefined(undefined) //=> false
 * @category Guard
 */
declare function isDefined<T>(data: T | undefined): data is T;
//#endregion
export { isDefined as t };
//# sourceMappingURL=isDefined-qAtIAoP_.d.cts.map