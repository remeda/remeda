type DefinitelyError<T> =
  Extract<T, Error> extends never ? Error : Extract<T, Error>;
/**
 * A function that checks if the passed parameter is an Error and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isError(data)
 * @returns true if the passed input is an Error, false otherwise
 * @example
 *    R.isError(new Error('message')) //=> true
 *    R.isError('somethingElse') //=> false
 * @category Guard
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Error is built-in and can't be made readonly easily.
export function isError<T>(data: Error | T): data is DefinitelyError<T> {
  return data instanceof Error;
}
