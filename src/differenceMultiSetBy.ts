import { createLazyDifferenceMultiSetByEvaluator } from './_createLazyDifferenceMultiSetByEvaluator';
import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the difference of two arrays using *multi-set* (or "bag") semantics.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * Unlike the set-based `differenceWith` function that remove *all* items from
 * `other`, this function keeps track of the number of copies of each item and
 * only removes the subtracted copies.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The array from which elements are subtracted.
 * @param other - The array whose elements will be subtracted.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.differenceMultiSetBy(data, other, scalarFunction)
 * @example
 *    R.differenceMultiSetBy([{id:1},{id:2}],[{id:1}],prop("id"));  // => [{id:2}]
 * @data_first
 * @category Array
 * @pipeable
 */
export function differenceMultiSetBy<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): Array<TData>;

/**
 * Computes the difference of two arrays using *multi-set* (or "bag") semantics.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * Unlike the set-based `differenceWith` function that remove *all* items from
 * `other`, this function keeps track of the number of copies of each item and
 * only removes the subtracted copies.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The array from which elements are subtracted.
 * @param other - The array whose elements will be subtracted.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.differenceMultiSet(other, scalarFunction)(data)
 * @example
 *    R.pipe([{id:1},{id:2}], R.differenceMultiSetBy([{id:1}],prop("id")));  // => [{id:2}]
 * @data_last
 * @category Array
 * @pipeable
 */
export function differenceMultiSetBy<TData, TOther = TData>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): (data: ReadonlyArray<TData>) => Array<TData>;

export function differenceMultiSetBy() {
  return purry(
    differenceMultiSetByImplementation,
    arguments,
    differenceMultiSetBy.lazy
  );
}

const differenceMultiSetByImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
) =>
  _reduceLazy(
    data,
    createLazyDifferenceMultiSetByEvaluator(other, scalarFunction)
  );

export namespace differenceMultiSetBy {
  export function lazy<TData, TOther = TData>(
    other: ReadonlyArray<TOther>,
    scalarFunction: (item: TData | TOther) => unknown
  ): LazyEvaluator<TData> {
    return createLazyDifferenceMultiSetByEvaluator<TData, TOther>(
      other,
      scalarFunction
    );
  }
}
