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
export function splitAt<T>(array: readonly T[], index: number): [T[], T[]];

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
export function splitAt<T>(index: number): (array: readonly T[]) => [T[], T[]];

export function splitAt(...args: readonly unknown[]): unknown {
  return purry(splitAtImplementation, args);
}

function splitAtImplementation<T>(
  array: readonly T[],
  index: number,
): [T[], T[]] {
  const effectiveIndex = Math.max(
    Math.min(index < 0 ? array.length + index : index, array.length),
    0,
  );
  return [array.slice(0, effectiveIndex), array.slice(effectiveIndex)];
}
