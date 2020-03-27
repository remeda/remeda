import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';

/**
 * Map each element of an array using a defined callback function.
 * @param array The array to map.
 * @param fn The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.indexed(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 2) // => [2, 4, 6]
 *    R.map.indexed([0, 0, 0], (x, i) => i) // => [0, 1, 2]
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T, K>(array: readonly T[], fn: Pred<T, K>): K[];

/**
 * Map each value of an object using a defined callback function.
 * @param fn the function mapper
 * @signature
 *    R.map(fn)(array)
 *    R.map.indexed(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [2, 4, 6]
 *    R.pipe([0, 0, 0], R.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T, K>(fn: Pred<T, K>): (array: readonly T[]) => K[];

export function map() {
  return purry(_map(false), arguments, map.lazy);
}

const _map = (indexed: boolean) => <T, K>(
  array: T[],
  fn: PredIndexedOptional<T, K>
) => {
  return _reduceLazy(
    array,
    indexed ? map.lazyIndexed(fn) : map.lazy(fn),
    indexed
  );
};

const _lazy = (indexed: boolean) => <T, K>(fn: PredIndexedOptional<T, K>) => {
  return (value: T, index?: number, array?: T[]): LazyResult<K> => {
    return {
      done: false,
      hasNext: true,
      next: indexed ? fn(value, index, array) : fn(value),
    };
  };
};

export namespace map {
  export function indexed<T, K>(
    array: readonly T[],
    fn: PredIndexed<T, K>
  ): K[];
  export function indexed<T, K>(
    fn: PredIndexed<T, K>
  ): (array: readonly T[]) => K[];
  export function indexed() {
    return purry(_map(true), arguments, map.lazyIndexed);
  }
  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
