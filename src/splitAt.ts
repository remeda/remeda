import { purry } from "./purry";

/**
 * Splits a given array at a given index.
 *
 * @param array - The array to split.
 * @param index - The index to split at.
 * @signature
 *    R.splitAt(array, index)
 * @example
 *    R.splitAt([1, 2, 3], 1) // => [[1], [2, 3]]
 *    R.splitAt([1, 2, 3, 4, 5], -1) // => [[1, 2, 3, 4], [5]]
 * @dataFirst
 * @category Array
 */
export function splitAt<T>(
  array: ReadonlyArray<T>,
  index: number,
): [Array<T>, Array<T>];

/**
 * Splits a given array at a given index.
 *
 * @param index - The index to split at.
 * @signature
 *    R.splitAt(index)(array)
 * @example
 *    R.splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    R.splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
export function splitAt<T>(
  index: number,
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitAt(...args: ReadonlyArray<unknown>): unknown {
  return purry(splitAtImplementation, args);
}

function splitAtImplementation<T>(
  array: ReadonlyArray<T>,
  index: number,
): [Array<T>, Array<T>] {
  const copy = [...array];
  const tail = copy.splice(index);
  return [copy, tail];
}
