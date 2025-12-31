//#region src/isDate.d.ts
/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Date, false otherwise.
 * @signature
 *    R.isDate(data)
 * @example
 *    R.isDate(new Date()) //=> true
 *    R.isDate('somethingElse') //=> false
 * @category Guard
 */
declare function isDate(data: unknown): data is Date;
//#endregion
export { isDate as t };
//# sourceMappingURL=isDate-B_H80yH5.d.ts.map