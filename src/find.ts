import { purry } from './purry';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';
import { _toLazyIndexed } from './_toLazyIndexed';
import { _toSingle } from './_toSingle';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
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
 */
export function find<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param fn the predicate
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
 */
export function find<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function find() {
  return purry(_find(false), arguments, find.lazy);
}

const _find =
  (indexed: boolean) =>
  <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    if (indexed) {
      return array.find(fn);
    }

    return array.find(x => fn(x));
  };

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, boolean>) => {
    return (value: T, index?: number, array?: Array<T>) => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      return {
        done: valid,
        hasNext: valid,
        next: value,
      };
    };
  };

export namespace find {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed() {
    return purry(_find(true), arguments, find.lazyIndexed);
  }

  export const lazy = _toSingle(_lazy(false));

  export const lazyIndexed = _toSingle(_toLazyIndexed(_lazy(true)));
}
