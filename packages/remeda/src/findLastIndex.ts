import doReduce from "./internal/doReduce";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";

/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    R.findLastIndex(data, predicate)
 * @example
 *    R.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 * @dataFirst
 * @category Array
 */
export function findLastIndex<T extends Iterable<unknown>>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): number;

/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    R.findLastIndex(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 * @dataLast
 * @category Array
 */
export function findLastIndex<T extends Iterable<unknown>>(
  predicate: ArrayMethodCallback<T, boolean>,
): (array: T) => number;

export function findLastIndex(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(findLastIndexImplementation, args);
}

const findLastIndexImplementation = <T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): number => {
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLastIndex` here.

  const array = toReadonlyArray(data);
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!, i, array)) {
      return i;
    }
  }

  return -1;
};
