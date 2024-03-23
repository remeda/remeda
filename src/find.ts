import { _toLazyIndexed } from "./_toLazyIndexed";
import { _toSingle } from "./_toSingle";
import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.find(items, fn)
 *    R.find.indexed(items, fn)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    R.find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 * @similarTo lodash find
 * @similarTo ramda find
 */
export function find<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>,
): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 *
 * @param fn - The predicate.
 * @signature
 *    R.find(fn)(items)
 *    R.find.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 * @similarTo lodash find
 * @similarTo ramda find
 */
export function find<T = never>(
  fn: Pred<T, boolean>,
): (array: ReadonlyArray<T>) => T | undefined;

export function find(): unknown {
  return purry(_find(false), arguments, find.lazy);
}

const _find =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) =>
    array.find((item, index, input) =>
      indexed ? fn(item, index, input) : fn(item),
    );

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T> =>
  (value, index, array) =>
    (indexed ? fn(value, index, array) : fn(value))
      ? { done: true, hasNext: true, next: value }
      : { done: false, hasNext: false };

export namespace find {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(): unknown {
    return purry(_find(true), arguments, find.lazyIndexed);
  }

  export const lazy = _toSingle(_lazy(false));

  export const lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
}
