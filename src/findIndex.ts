import { _toSingle } from "./_toSingle";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

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
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
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
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => number;

export function findIndex(): unknown {
  return purry(
    findIndexImplementation,
    arguments,
    _toSingle(lazyImplementation),
  );
}

const findIndexImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number => data.findIndex(predicate);

const lazyImplementation = <T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): LazyEvaluator<T, number> => {
  // TODO: We use the `actualIndex` here because we can't trust the index coming from pipe. This is due to the fact that the `indexed` abstraction might turn off incrementing the index or not send it at all. Once we simplify the code base by removing the non-indexed versions, we can remove this.
  let actualIndex = 0;
  return (value, index, data) => {
    if (predicate(value, index, data)) {
      return { done: true, hasNext: true, next: actualIndex };
    }
    actualIndex += 1;
    return { done: false, hasNext: false };
  };
};
