import { purry } from "./purry";
import type { PredIndexed, PredIndexedOptional } from "./_types";

const _sumBy =
  (indexed: boolean) =>
  <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let sum = 0;
    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump our Typescript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value.
      const item = array[index]!;
      const summand = indexed ? fn(item, index, array) : fn(item);
      sum += summand;
    }
    return sum;
  };

/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * ! **DEPRECATED**: Use `<T>(items: ReadonlyArray<T>) => R.reduce(R.map(items, fn), (sum, item) => R.add(sum, item), 0)` or if part of a pipe: `R.pipe(..., map(fn), reduce((sum, item) => R.add(sum, item), 0), ...)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.sumBy(fn)(array)
 *   R.sumBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.reduce(R.map(items, fn), (sum, item) => R.add(sum, item), 0)` or if part of a pipe: `R.pipe(..., map(fn), reduce((sum, item) => R.add(sum, item), 0), ...)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
 */

export function sumBy<T>(
  fn: (item: T) => number,
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * ! **DEPRECATED**: Use `R.reduce(R.map(items, fn), (sum, item) => R.add(sum, item), 0)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.sumBy(array, fn)
 *   R.sumBy.indexed(array, fn)
 * @example
 *    R.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.reduce(R.map(items, fn), (sum, item) => R.add(sum, item), 0)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
 */

export function sumBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number,
): number;

export function sumBy(): unknown {
  return purry(_sumBy(false), arguments);
}

export namespace sumBy {
  /* eslint-disable-next-line jsdoc/require-example, jsdoc/require-description */
  /**
   * @deprecated Use `R.reduce(R.map.indexed(array, fn), (sum, item) => R.add(sum, item), 0)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
   */
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>,
  ): number;

  /* eslint-disable-next-line jsdoc/require-example, jsdoc/require-description */
  /**
   * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.reduce(R.map.indexed(items, fn), (sum, item) => R.add(sum, item), 0)` or if part of a pipe `R.pipe(..., R.map.indexed(fn), R.reduce((sum, item) => R.add(sum, item), 0), ...)`. This function might be removed in V2, but we are not sure yet so if you have a strong opinion about this please post an issue on GitHub to surface it.
   */
  export function indexed<T>(
    fn: PredIndexed<T, number>,
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(): unknown {
    return purry(_sumBy(true), arguments);
  }
}
