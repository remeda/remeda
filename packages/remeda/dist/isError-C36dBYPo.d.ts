//#region src/isError.d.ts
type DefinitelyError<T> = Extract<T, Error> extends never ? Error : Extract<T, Error>;
/**
 * A function that checks if the passed parameter is an Error and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Error, false otherwise.
 * @signature
 *    R.isError(data)
 * @example
 *    R.isError(new Error('message')) //=> true
 *    R.isError('somethingElse') //=> false
 * @category Guard
 */
declare function isError<T>(data: Error | T): data is DefinitelyError<T>;
//#endregion
export { isError as t };
//# sourceMappingURL=isError-C36dBYPo.d.ts.map