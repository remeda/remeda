import { _toSingle } from "./_toSingle";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param predicate the predicate
 * @signature
 *    R.findIndex(items, predicate)
 *    R.findIndex.indexed(items, predicate)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 *    R.findIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number;

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param predicate the predicate
 * @signature
 *    R.findIndex(predicate)(items)
 *    R.findIndex.indexed(predicate)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ) // => 2
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex.indexed((n, i) => n % 2 === 0)
 *    ) // => 2
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => number;

export function findIndex(): unknown {
  return purry(
    findIndexImplementation,
    arguments,
    _toSingle(lazyImplementation),
  );
}

const findIndexImplementation = <T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number =>
  // eslint-disable-next-line unicorn/no-array-callback-reference -- predicate is built base on the signature for Array.prototype.findIndex
  array.findIndex(predicate);

const lazyImplementation = <T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): LazyEvaluator<T, number> => {
  // TODO: We use the `actualIndex` here because we can't trust the index coming from pipe. This is due to the fact that the `indexed` abstraction might turn off incrementing the index or not send it at all. Once we simplify the code base by removing the non-indexed versions, we can remove this.
  let actualIndex = 0;
  return (value, index, array) => {
    if (predicate(value, index, array)) {
      return { done: true, hasNext: true, next: actualIndex };
    }

    actualIndex += 1;
    return { done: false, hasNext: false };
  };
};
