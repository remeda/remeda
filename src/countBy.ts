/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- ignore for deprecated files */

import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import { purry } from "./purry";

const _countBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    let out = 0;
    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump our TypeScript target above ES5 we can use Array.prototype.entries to iterate over the indices and values at the same time.
      const item = array[index]!;
      const value = indexed ? fn(item, index, array) : fn(item);
      out += value ? 1 : 0;
    }
    return out;
  };

/**
 * Counts how many values of the collection pass the specified predicate.
 *
 * ! **DEPRECATED**: Use `R.filter(items, fn).length`. Will be removed in v2!
 *
 * @param items - The input data.
 * @param fn - The predicate.
 * @signature
 *    R.countBy(array, fn)
 * @example
 *    R.countBy([1, 2, 3, 4, 5], x => x % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.filter(items, fn).length`. Will be removed in v2.
 */
export function countBy<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>,
): number;

/**
 * Counts how many values of the collection pass the specified predicate.
 *
 * ! **DEPRECATED**: Use `<T>(items: ReadonlyArray<T>) => R.filter(items, fn).length`. Will be removed in v2!
 *
 * @param fn - The predicate.
 * @signature
 *    R.countBy(fn)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.filter(items, fn).length`. Will be removed in v2.
 */
export function countBy<T>(
  fn: Pred<T, boolean>,
): (array: ReadonlyArray<T>) => number;

export function countBy(): unknown {
  return purry(_countBy(false), arguments);
}

export namespace countBy {
  /**
   * Counts how many values of the collection pass the specified predicate.
   *
   * ! **DEPRECATED**: Use `R.filter.indexed(items, fn).length`. Will be removed in v2!
   *
   * @example
   *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
   * @deprecated Use `R.filter.indexed(items, fn).length`. Will be removed in v2.
   */
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): number;
  /**
   * Counts how many values of the collection pass the specified predicate.
   *
   * ! **DEPRECATED**: Use `<T>(items: ReadonlyArray<T>) => R.filter.indexed(items, fn).length`. Will be removed in v2!
   *
   * @example
   *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
   * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.filter.indexed(items, fn).length`. Will be removed in v2.
   */
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => number;
  export function indexed(): unknown {
    return purry(_countBy(true), arguments);
  }
}
