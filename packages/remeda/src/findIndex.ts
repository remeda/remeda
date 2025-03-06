import doReduce from "./internal/doReduce";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import { mapCallback } from "./internal/utilityEvaluators";
import { isArray } from "./isArray";

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(data, predicate)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @lazy
 * @category Array
 */
export function findIndex<T extends Iterable<unknown>>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): number;

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @lazy
 * @category Array
 */
export function findIndex<T extends Iterable<unknown>>(
  predicate: ArrayMethodCallback<T, boolean>,
): (data: T) => number;

export function findIndex(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(findIndexImplementation, args);
}

function findIndexImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): number {
  if (isArray(data)) {
    return data.findIndex(predicate);
  }

  let index = 0;
  for (const [, flag] of mapCallback(data, predicate)) {
    if (flag) {
      return index;
    }
    index++;
  }
  return -1;
}
