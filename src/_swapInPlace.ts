/* eslint-disable unicorn/prevent-abbreviations -- This is fine... */

/**
 * An efficient hack to swap the values at two indices in an array *in-place*.
 */
export function swapInPlace(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional
  data: Array<unknown>,
  i: number,
  j: number,
): void {
  // We use destructuring to perform an in-place swap *without* needing a
  // temporary variable
  [data[i], data[j]] = [data[j], data[i]];
}
