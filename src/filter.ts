import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';
import { _toLazyIndexed } from './_toLazyIndexed';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param array The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.filter(array, fn)
 *    R.filter.indexed(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 *    R.filter.indexed([1, 2, 3], (x, i, array) => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  array: ReadonlyArray<T>,
  fn: (value: T) => value is S
): Array<S>;
export function filter<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): Array<T>;

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param fn the callback function.
 * @signature
 *    R.filter(fn)(array)
 *    R.filter.indexed(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 *    R.pipe([1, 2, 3], R.filter.indexed((x, i) => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  fn: (input: T) => input is S
): (array: ReadonlyArray<T>) => Array<S>;
export function filter<T>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => Array<T>;

export function filter() {
  return purry(_filter(false), arguments, filter.lazy);
}

const _filter =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    return _reduceLazy(
      array,
      indexed ? filter.lazyIndexed(fn) : filter.lazy(fn),
      indexed
    );
  };

const _lazy =
  (indexed: boolean) =>
  <T>(fn: PredIndexedOptional<T, boolean>) => {
    return (
      value: T,
      index?: number,
      array?: ReadonlyArray<T>
    ): LazyResult<T> => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      if (valid) {
        return {
          done: false,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  };

export namespace filter {
  export function indexed<T, S extends T>(
    array: ReadonlyArray<T>,
    fn: (input: T, index: number, array: Array<T>) => input is S
  ): Array<S>;
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): Array<T>;
  /**
   * @dataLast
   */
  export function indexed<T, S extends T>(
    fn: (input: T, index: number, array: Array<T>) => input is S
  ): (array: ReadonlyArray<T>) => Array<S>;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed() {
    return purry(_filter(true), arguments, filter.lazyIndexed);
  }

  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
