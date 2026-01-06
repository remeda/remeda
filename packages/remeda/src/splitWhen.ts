import { purry } from "./purry";

/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(array, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): [T[], T[]];

/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(fn)(array)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): (array: readonly T[]) => [T[], T[]];

export function splitWhen(...args: readonly unknown[]): unknown {
  return purry(splitWhenImplementation, args);
}

function splitWhenImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): [T[], T[]] {
  const index = data.findIndex(predicate);
  return index === -1
    ? [[...data], []]
    : [data.slice(0, index), data.slice(index)];
}
