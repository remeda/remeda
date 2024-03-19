/**
 * A data-last version of `String.prototype.slice` so it could be used in pipes.
 *
 * NOTE: You don't need this function if you are calling it directly, just use
 * `String.prototype.slice` directly. This function doesn't provide any type
 * improvements over the built-in types.
 *
 * @param indexStart - The index of the first character to include in the returned substring.
 * @param indexEnd - (optional) The index of the first character to exclude from the returned substring.
 * @signature
 *    R.sliceString(indexStart)(string)
 *    R.sliceString(indexStart, indexEnd)(string)
 * @example
 *    R.sliceString(1)(`abcdefghijkl`) // => `bcdefghijkl`
 *    R.sliceString(4, 7)(`abcdefghijkl`) // => `efg`
 * @dataLast
 * @category String
 */
export const sliceString =
  (indexStart: number, indexEnd?: number): ((data: string) => string) =>
  (data) =>
    data.slice(indexStart, indexEnd);
