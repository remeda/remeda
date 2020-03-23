/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @category Array
 */
export function last<T>(array: readonly T[]): T | undefined {
  return array[array.length - 1];
}
