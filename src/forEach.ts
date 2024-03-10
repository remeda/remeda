import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param array The array.
 * @param fn The callback function.
 * @returns The original array
 * @signature
 *    R.forEach(array, fn)
 *    R.forEach.indexed(array, fn)
 * @example
 *    R.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    }) // => [1, 2, 3]
 *    R.forEach.indexed([1, 2, 3], (x, i) => {
 *      console.log(x, i)
 *    }) // => [1, 2, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, void>,
): Array<T>;

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param fn the function mapper
 * @signature
 *    R.forEach(fn)(array)
 *    R.forEach.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach.indexed((x, i) => {
 *        console.log(x, i)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  fn: Pred<T, void>,
): (array: ReadonlyArray<T>) => Array<T>;

export function forEach(): unknown {
  return purry(_forEach(false), arguments, forEach.lazy);
}

const _forEach =
  (indexed: boolean) =>
  <T, K>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, K>) =>
    _reduceLazy(array, indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn));

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, void>): LazyEvaluator<T> =>
  (value, index, array) => {
    if (indexed) {
      fn(value, index, array);
    } else {
      fn(value);
    }
    return {
      done: false,
      hasNext: true,
      next: value,
    };
  };

export namespace forEach {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, void>,
  ): Array<T>;
  export function indexed<T>(
    fn: PredIndexed<T, void>,
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed(): unknown {
    return purry(_forEach(true), arguments, forEach.lazyIndexed);
  }
  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
