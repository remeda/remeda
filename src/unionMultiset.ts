import { createLazyDifferenceMultisetByEvaluator } from './_createLazyDifferenceMultisetByEvaluator';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the union of two arrays using *multi-set* (or "bag") semantics. This
 * means that for each item, the output would contain as many copies of the item
 * as the max number of copies in *either* `data` or `other` arrays.
 *
 * If you need set semantics (no duplicates) use `concat` and then `uniq`.
 *
 * The output array is stable, it would contain all items of `data` in the same
 * order, and then all items of `other` that aren't already included, in the
 * order they are in `other`.
 *
 * @param data - The base array.
 * @param other - The array to union with.
 * @signature
 *    R.unionMultiset(data, other)
 * @example
 *    R.unionMultiset([1, 2, 3], [2, 3, 4]) // => [1, 2, 3, 4]
 *    R.unionMultiset([1, 2, 3], [4, 2, 2, 2, 3]) // => [1, 2, 3, 4, 2, 2]
 * @data_first
 * @category Array
 */
export function unionMultiset<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>];

/**
 * Computes the union of two arrays using *multi-set* (or "bag") semantics. This
 * means that for each item, the output would contain as many copies of the item
 * as the max number of copies in *either* `data` or `other` arrays.
 *
 * If you need set semantics (no duplicates) use `concat` and then `uniq`.
 *
 * The output array is stable, it would contain all items of `data` in the same
 * order, and then all items of `other` that aren't already included, in the
 * order they are in `other`.
 *
 * @param data - The base array.
 * @param other - The array to union with.
 * @signature
 *    R.unionMultiset(other)(data)
 * @example
 *    R.pipe([1, 2, 3], R.unionMultiset([2, 3, 4])) // => [1, 2, 3, 4]
 *    R.pipe([1, 2, 3], R.unionMultiset([4, 2, 2, 2, 3])) // => [1, 2, 3, 4, 2, 2]
 * @data_last
 * @category Array
 */
export function unionMultiset<TData, TOther = TData>(
  other: ReadonlyArray<TOther>
): (data: ReadonlyArray<TData>) => [...Array<TData>, ...Array<TOther>];

export function unionMultiset() {
  return purry(unionMultisetImplementation, arguments);
}

const unionMultisetImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>] => [
  ...data,
  // A multi-set union is similar to an array concat, with the exception that
  // we need to remove items that are already in the first array. This is a copy
  // of the same code that implements `differenceMutltiset` - We do this to
  // avoid exporting the non-purried implementation function from that file.
  ..._reduceLazy(other, createLazyDifferenceMultisetByEvaluator(data)),
];

// TODO: Our `lazy` constructs currently don't support the notion of an "end"
// event that would allow us to dump all remaining items from the other array
// after we lazily iterate over the base array. Because of that we can't
// implement a lazy version of this function.
