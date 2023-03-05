import { purry } from './purry';
import { PredIndexedOptional, PredIndexed } from './_types';

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param items the items to split
 * @param predicate a type guard function to invoke on every item
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @data_first
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => item is S
): [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param items the items to split
 * @param predicate the function invoked per iteration
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @data_first
 * @indexed
 * @category Array
 */
export function partition<T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): [Array<T>, Array<T>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param predicate the grouping function
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @data_last
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  predicate: (item: T) => item is S
): (array: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param predicate the grouping function
 * @returns the array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @data_last
 * @indexed
 * @category Array
 */
export function partition<T>(
  predicate: (item: T) => boolean
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function partition() {
  return purry(_partition(false), arguments);
}

const _partition =
  (indexed: boolean) =>
  <T>(array: Array<T>, fn: PredIndexedOptional<T, any>) => {
    const ret: [Array<T>, Array<T>] = [[], []];
    array.forEach((item, index) => {
      const matches = indexed ? fn(item, index, array) : fn(item);
      ret[matches ? 0 : 1].push(item);
    });
    return ret;
  };

export namespace partition {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    predicate: PredIndexed<T, boolean>
  ): [Array<T>, Array<T>];
  export function indexed<T, K>(
    predicate: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
  export function indexed() {
    return purry(_partition(true), arguments);
  }
}
