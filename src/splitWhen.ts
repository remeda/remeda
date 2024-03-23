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

export function splitWhen(): unknown {
  return purry(splitWhenImplementation, arguments);
}

function splitWhenImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] {
  for (let i = 0; i < data.length; i++) {
    // TODO: Use `Array.prototype.entries` once we bump our TS target so we
    // can get both the index and the item at the same time, and don't need
    // the non-null assertion.
    if (predicate(data[i]!, i, data)) {
      return splitAt(data, i);
    }
  }

  return [data.slice(), []];
}
