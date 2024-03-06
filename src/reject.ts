import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items - The array to reject.
 * @param fn - The callback function.
 * @signature
 *    R.reject(array, fn)
 *    R.reject.indexed(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function reject<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>,
): Array<T>;

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items - The array to reject.
 * @param fn - The callback function.
 * @signature
 *    R.reject(array, fn)
 *    R.reject.indexed(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function reject<T>(
  fn: Pred<T, boolean>,
): (items: ReadonlyArray<T>) => Array<T>;

export function reject(): unknown {
  return purry(_reject(false), arguments, reject.lazy);
}

const _reject =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) =>
    _reduceLazy(
      array,
      indexed ? reject.lazyIndexed(fn) : reject.lazy(fn),
      indexed,
    );

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T> =>
  (item, index, data) =>
    (indexed ? fn(item, index, data) : fn(item))
      ? { done: false, hasNext: false }
      : { done: false, hasNext: true, next: item };

export namespace reject {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): Array<K>;
  export function indexed<T, K>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => Array<K>;
  export function indexed(): unknown {
    return purry(_reject(true), arguments, reject.lazyIndexed);
  }

  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
