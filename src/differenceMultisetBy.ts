import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { createLazyDifferenceMultisetByEvaluator } from './_createLazyDifferenceMultisetByEvaluator';
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
 *    R.differenceMultisetBy(data, other, scalarFunction)
 * @example
 *    R.differenceMultisetBy([{id:1},{id:2}],[{id:1}],prop("id"));  // => [{id:2}]
 * @data_first
 * @category Array
 * @pipeable
 */
export function differenceMultisetBy<
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
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
 *    R.differenceMultiset(other, scalarFunction)(data)
 * @example
 *    R.pipe([{id:1},{id:2}], R.differenceMultisetBy([{id:1}],prop("id")));  // => [{id:2}]
 * @data_last
 * @category Array
 * @pipeable
 */
export function differenceMultisetBy<
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
): (data: ReadonlyArray<TData>) => Array<TData>;

export function differenceMultisetBy() {
  return purry(
    differenceMultisetByImplementation,
    arguments,
    differenceMultisetBy.lazy
  );
}

const differenceMultisetByImplementation = <
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
) =>
  _reduceLazy(
    data,
    createLazyDifferenceMultisetByEvaluator(other, scalarFunction)
  );

export namespace differenceMultisetBy {
  export function lazy<TData, TOther = TData, TScalar = TData | TOther>(
    other: ReadonlyArray<TOther>,
    scalarFunction: (item: TData | TOther) => TScalar
  ): LazyEvaluator<TData> {
    return createLazyDifferenceMultisetByEvaluator<TData, TOther, TScalar>(
      other,
      scalarFunction
    );
  }
}
