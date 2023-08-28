import { createLazyIntersectionMultiSetByEvaluator } from './_createLazyIntersectionMultiSetByEvaluator';
import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the intersection of two arrays using *multi-set* (or "bag")
 * semantics.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * Unlike the set-based `intersection` function that adds *all* items that have
 * a matching item in `other`, this function keeps track of the number of copies
 * of each item and only adds matching *copies*.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The base array.
 * @param other - The array that items would be compared against.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.intersectionMultiSetBy(data, other, scalarFunctions)
 * @example
 *    R.intersectionMultiSetBy([{id:1}, {id:2}],[{id:2},{id:3}],prop('id'));  // => [{id:2}]
 * @data_first
 * @category Array
 * @pipeable
 */
export function intersectionMultiSetBy<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): Array<TData>;

/**
 * Computes the intersection of two arrays using *multi-set* (or "bag")
 * semantics.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * Unlike the set-based `intersection` function that adds *all* items that have
 * a matching item in `other`, this function keeps track of the number of copies
 * of each item and only adds matching *copies*.
 *
 * The output array is stable, preserving the order of items as the input.
 *
 * @param data - The base array.
 * @param other - The array that items would be compared against.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.intersectionMultiSetBy(other, scalarFunctions)(data)
 * @example
 *    R.pipe([{id:1}, {id:2}], R.intersectionMultiSetBy([{id:2},{id:3}],prop('id')));  // => [{id:2}]
 * @data_last
 * @category Array
 * @pipeable
 */
export function intersectionMultiSetBy<TData, TOther = TData>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): (data: ReadonlyArray<TData>) => Array<TData & TOther>;

export function intersectionMultiSetBy() {
  return purry(
    intersectionMultiSetByImplementation,
    arguments,
    intersectionMultiSetBy.lazy
  );
}

const intersectionMultiSetByImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): Array<TData> =>
  _reduceLazy(
    data,
    createLazyIntersectionMultiSetByEvaluator<TData, TOther>(
      other,
      scalarFunction
    )
  );

export namespace intersectionMultiSetBy {
  export function lazy<TData, TOther = TData>(
    other: ReadonlyArray<TOther>,
    scalarFunction: (item: TData | TOther) => unknown
  ): LazyEvaluator<TData> {
    return createLazyIntersectionMultiSetByEvaluator<TData, TOther>(
      other,
      scalarFunction
    );
  }
}
