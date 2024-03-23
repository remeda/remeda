import { splitAt } from "./splitAt";
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
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>];

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
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen(...args: ReadonlyArray<unknown>): unknown {
  return purry(splitWhenImplementation, args);
}

function splitWhenImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] {
  for (const [index, item] of data.entries()) {
    if (predicate(item, index, data)) {
      return splitAt(data, index);
    }
  }

  return [[...data], []];
}
