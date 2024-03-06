import { purry } from "./purry";
import type { PredIndexedOptional, PredIndexed } from "./_types";

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param items - The items to split.
 * @param predicate - A type guard function to invoke on every item.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => item is S,
): [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param items - The items to split.
 * @param predicate - The function invoked per iteration.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @indexed
 * @category Array
 */
export function partition<T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => boolean,
): [Array<T>, Array<T>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param predicate - The grouping function.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  predicate: (item: T) => item is S,
): (array: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param predicate - The grouping function.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @indexed
 * @category Array
 */
export function partition<T>(
  predicate: (item: T) => boolean,
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function partition() {
  return purry(_partition(false), arguments);
}

const _partition =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    const ret: [Array<T>, Array<T>] = [[], []];
    array.forEach((item, index) => {
      const matches = indexed ? fn(item, index, array) : fn(item);
      ret[matches ? 0 : 1].push(item);
    });
    return ret;
  };

export namespace partition {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    predicate: PredIndexed<T, boolean>,
  ): [Array<T>, Array<T>];
  export function indexed<T>(
    predicate: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
  export function indexed() {
    return purry(_partition(true), arguments);
  }
}
