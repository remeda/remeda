import { createLazyDifferenceMultiSetByEvaluator } from './_createLazyDifferenceMultiSetByEvaluator';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the symmetric difference of two arrays using *multi-set* (or "bag")
 * semantics. This is a short-hand for the concatenation of the multi-set
 * differences of the two input arrays.
 *
 * The output array is stable, preserving the order of items from both inputs.
 *
 * @param data - an array (these items will be first)
 * @param other - another array (these items will be last)
 * @signature
 *   R.symmetricDifferenceMultiSet(data, other)
 * @example
 *   R.symmetricDifferenceMultiSet([1,2,3], [2,3,4]); // => [1,4]
 *   R.symmetricDifferenceMultiSet([1,2,2,3], [2,3,3,4]); // => [1,2,3,4]
 * @data_first
 * @category Array
 */
export function symmetricDifferenceMultiSet<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>];

/**
 * Computes the symmetric difference of two arrays using *multi-set* (or "bag")
 * semantics. This is a short-hand for the concatenation of the multi-set
 * differences of the two input arrays.
 *
 * The output array is stable, preserving the order of items from both inputs.
 *
 * @param data - an array (these items will be first)
 * @param other - another array (these items will be last)
 * @signature
 *   R.symmetricDifferenceMultiSet(other)(data)
 * @example
 *   R.pipe([1,2,3], R.symmetricDifferenceMultiSet([2,3,4])); // => [1,4]
 *   R.pipe([1,2,2,3], R.symmetricDifferenceMultiSet([2,3,3,4])); // => [1,2,3,4]
 * @data_last
 * @category Array
 */
export function symmetricDifferenceMultiSet<TData, TOther = TData>(
  other: ReadonlyArray<TOther>
): (data: ReadonlyArray<TData>) => [...Array<TData>, ...Array<TOther>];

export function symmetricDifferenceMultiSet() {
  return purry(symmetricDifferenceMultiSetImplementation, arguments);
}

const symmetricDifferenceMultiSetImplementation = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>] => [
  ...difference(data, other),
  ...difference(other, data),
];

// This is a copy of the same code that implements `differenceMutltiSet` - We do
// this to avoid exporting the non-purried implementation function from that
// file.
const difference = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
) => _reduceLazy(data, createLazyDifferenceMultiSetByEvaluator(other));
