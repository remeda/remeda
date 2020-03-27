import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';

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
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(array: readonly T[], fn: Pred<T, void>): T[];

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
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(fn: Pred<T, void>): (array: readonly T[]) => T[];

export function forEach() {
  return purry(_forEach(false), arguments, forEach.lazy);
}

const _forEach = (indexed: boolean) => <T, K>(
  array: T[],
  fn: PredIndexedOptional<T, K>
) => {
  return _reduceLazy(
    array,
    indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn),
    indexed
  );
};

const _lazy = (indexed: boolean) => <T>(fn: PredIndexedOptional<T, void>) => {
  return (value: T, index?: number, array?: T[]): LazyResult<T> => {
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
};

export namespace forEach {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, void>
  ): T[];
  export function indexed<T>(
    fn: PredIndexed<T, void>
  ): (array: readonly T[]) => T[];
  export function indexed() {
    return purry(_forEach(true), arguments, forEach.lazyIndexed);
  }
  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
