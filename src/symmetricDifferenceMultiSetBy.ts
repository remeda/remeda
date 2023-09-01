import { createLazyDifferenceMultiSetByEvaluator } from './_createLazyDifferenceMultiSetByEvaluator';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the symmetric difference of two arrays using *multi-set* (or "bag")
 * semantics. This is a short-hand for the concatenation of the multi-set
 * differences of the two input arrays.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * The output array is stable, preserving the order of items from both inputs.
 *
 * @param data - an array (these items will be first)
 * @param other - another array (these items will be last)
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.symmetricDifferenceMultiSet(data, other, scalarFunction)
 * @example
 *   R.symmetricDifferenceMultiSet([{id:1},{id:2},{id:3}], [{id:2},{id:3},{id:4}], prop('id')); // => [{id:1},{id:4}]
 * @data_first
 * @category Array
 */
export function symmetricDifferenceMultiSetBy<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): [...Array<TData>, ...Array<TOther>];

/**
 * Computes the symmetric difference of two arrays using *multi-set* (or "bag")
 * semantics. This is a short-hand for the concatenation of the multi-set
 * differences of the two input arrays.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * The output array is stable, preserving the order of items from both inputs.
 *
 * @param data - an array (these items will be first)
 * @param other - another array (these items will be last)
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.symmetricDifferenceMultiSet(other, scalarFunction)(data)
 * @example
 *   R.pipe([{id:1},{id:2},{id:3}], R.symmetricDifferenceMultiSet([{id:2},{id:3},{id:4}], prop('id'))); // => [{id:1},{id:4}]
 * @data_last
 * @category Array
 */
export function symmetricDifferenceMultiSetBy<TData, TOther = TData>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): (data: ReadonlyArray<TData>) => [...Array<TData>, ...Array<TOther>];

export function symmetricDifferenceMultiSetBy() {
  return purry(symmetricDifferenceMultiSetImplementationBy, arguments);
}

const symmetricDifferenceMultiSetImplementationBy = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): [...Array<TData>, ...Array<TOther>] => [
  ...difference(data, other, scalarFunction),
  ...difference(other, data, scalarFunction),
];

// This is a copy of the same code that implements `differenceMutltiSet` - We do
// this to avoid exporting the non-purried implementation function from that
// file.
const difference = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
) =>
  _reduceLazy(
    data,
    createLazyDifferenceMultiSetByEvaluator(other, scalarFunction)
  );
