/**
 * Returns a list of elements that exist in both array.
 * @param source the first array
 * @param other the second array
 * @signature
 *    R.intersection(source, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]) // => [2, 3]
 * @category Array
 */
export function intersection<T>(source: T[], other: T[]) {
  const set = new Set(other);
  return source.filter(x => set.has(x));
}
