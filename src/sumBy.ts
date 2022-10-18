import { purry } from './purry';
import { PredIndexed, PredIndexedOptional } from './_types';

const _sumBy =
  (indexed: boolean) =>
  <T>(array: T[], fn: PredIndexedOptional<T, number>) => {
    let sum = 0;
    array.forEach((item, i) => {
      const summand = indexed ? fn(item, i, array) : fn(item);
      sum += summand;
    });
    return sum;
  };

/**
 * Returns the sum of the elements of an array using the provided predicate.
 * @param fn predicate function
 * @signiture
 *   R.sumBy(fn)(array)
 *   R.sumBy.indexed(fn)(array)
 * @example
 *    R.
 */

export function sumBy<T>(
  fn: (item: T) => number
): (items: readonly T[]) => number;

export function sumBy<T>(items: readonly T[], fn: (item: T) => number): number;

export function sumBy() {
  return purry(_sumBy(false), arguments);
}

export namespace sumBy {
  export function indexed<T>(
    array: readonly T[],
    fn: PredIndexed<T, number>
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: readonly T[]) => number;

  export function indexed() {
    return purry(_sumBy(true), arguments);
  }
}
