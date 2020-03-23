import { purry } from './purry';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';
import { _toLazyIndexed } from './_toLazyIndexed';
import { _toSingle } from './_toSingle';

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
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(array: readonly T[], fn: Pred<T, boolean>): number;

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
 *    ) // => 4
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  fn: Pred<T, boolean>
): (array: readonly T[]) => number;

export function findIndex() {
  return purry(_findIndex(false), arguments, findIndex.lazy);
}

const _findIndex = (indexed: boolean) => <T>(
  array: T[],
  fn: PredIndexedOptional<T, boolean>
) => {
  if (indexed) {
    return array.findIndex(fn);
  }

  return array.findIndex(x => fn(x));
};

const _lazy = (indexed: boolean) => <T>(
  fn: PredIndexedOptional<T, boolean>
) => {
  let i = 0;
  return (value: T, index?: number, array?: T[]) => {
    const valid = indexed ? fn(value, index, array) : fn(value);
    if (valid) {
      return {
        done: true,
        hasNext: true,
        next: i,
      };
    }
    i++;
    return {
      done: false,
      hasNext: false,
    };
  };
};

export namespace findIndex {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: readonly T[]) => T | undefined;
  export function indexed() {
    return purry(_findIndex(true), arguments, findIndex.lazyIndexed);
  }

  export const lazy = _toSingle(_lazy(false));

  export const lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
}
