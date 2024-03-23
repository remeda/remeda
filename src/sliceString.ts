/**
 * Extracts a section of this string and returns it as a new string, without
 * modifying the original string. Equivalent to `String.prototype.slice`.
 *
 * @param data - The string to extract from.
 * @param indexStart - The index of the first character to include in the
 * returned substring.
 * @param indexEnd - The index of the first character to exclude from the
 * returned substring.
 * @returns A new string containing the extracted section of the string.
 * @signature
 *    R.sliceString(data, indexStart, indexEnd)
 * @example
 *    R.sliceString("abcdefghijkl", 1) // => `bcdefghijkl`
 *    R.sliceString("abcdefghijkl", 4, 7) // => `efg`
 * @dataLast
 * @category String
 */
export function sliceString(
  data: string,
  indexStart: number,
  indexEnd?: number,
): string;

/**
 * Extracts a section of this string and returns it as a new string, without
 * modifying the original string. Equivalent to `String.prototype.slice`.
 *
 * @param indexStart - The index of the first character to include in the
 * returned substring.
 * @param indexEnd - The index of the first character to exclude from the
 * returned substring, or `undefined` for the rest of the string.
 * @returns A new string containing the extracted section of the string.
 * @signature
 *    R.sliceString(indexStart, indexEnd)(string)
 * @example
 *    R.sliceString(1)("abcdefghijkl") // => `bcdefghijkl`
 *    R.sliceString(4, 7)("abcdefghijkl") // => `efg`
 * @dataLast
 * @category String
 */
export function sliceString(
  indexStart: number,
  indexEnd?: number,
): (data: string) => string;

export function sliceString(
  dataOrIndexStart: number | string,
  indexStartOrIndexEnd?: number,
  indexEnd?: number,
): unknown {
  return typeof dataOrIndexStart === "string"
    ? dataOrIndexStart.slice(indexStartOrIndexEnd, indexEnd)
    : (data: string) => data.slice(dataOrIndexStart, indexStartOrIndexEnd);
}
