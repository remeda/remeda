import { _toLazyIndexed } from "./_toLazyIndexed";
import { _toSingle } from "./_toSingle";
import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.findIndex(items, fn)
 *    R.findIndex.indexed(items, fn)
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
  fn: Pred<T, boolean>,
): number;

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.findIndex(fn)(items)
 *    R.findIndex.indexed(fn)(items)
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
  fn: Pred<T, boolean>,
): (array: ReadonlyArray<T>) => number;

export function findIndex(): unknown {
  return purry(_findIndex(false), arguments, findIndex.lazy);
}

const _findIndex =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) =>
    array.findIndex((item, index, input) =>
      indexed ? fn(item, index, input) : fn(item),
    );

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T, number> => {
    // TODO: We use the `actualIndex` here because we can't trust the index coming from pipe. This is due to the fact that the `indexed` abstraction might turn off incrementing the index or not send it at all. Once we simplify the code base by removing the non-indexed versions, we can remove this.
    let actualIndex = 0;
    return (value, index, array) => {
      if (indexed ? fn(value, index, array) : fn(value)) {
        return { done: true, hasNext: true, next: actualIndex };
      }
      actualIndex += 1;
      return { done: false, hasNext: false };
    };
  };

export namespace findIndex {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => number;
  export function indexed(): unknown {
    return purry(_findIndex(true), arguments, findIndex.lazyIndexed);
  }

  export const lazy = _toSingle(_lazy(false));

  export const lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
}
