import { createLazyDifferenceMultisetByEvaluator } from './_createLazyDifferenceMultisetByEvaluator';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

/**
 * Computes the union of two arrays using *multi-set* (or "bag") semantics. This
 * means that for each item, the output would contain as many copies of the item
 * as the max number of copies in *either* `data` or `other` arrays.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * If you need set semantics (no duplicates) use `concat` and then `uniqBy`.
 *
 * The output array is stable, it would contain all items of `data` in the same
 * order, and then all items of `other` that aren't already included, in the
 * order they are in `other`.
 *
 * @param data - The base array.
 * @param other - The array to union with.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.unionMultisetBy(data, other, scalarFunction)
 * @example
 *    R.unionMultisetBy([{id:1},{id:2}],[{id:1}],prop("id"));  // => [{id:1},{id:2}]
 * @data_first
 * @category Array
 */
export function unionMultisetBy<
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
): [...Array<TData>, ...Array<TOther>];

/**
 * Computes the union of two arrays using *multi-set* (or "bag") semantics. This
 * means that for each item, the output would contain as many copies of the item
 * as the max number of copies in *either* `data` or `other` arrays.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * If you need set semantics (no duplicates) use `concat` and then `uniq`.
 *
 * The output array is stable, it would contain all items of `data` in the same
 * order, and then all items of `other` that aren't already included, in the
 * order they are in `other`.
 *
 * @param data - The base array.
 * @param other - The array to union with.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *    R.unionMultisetBy(other, scalarFunction)(data)
 * @example
 *    R.pipe([{id:1},{id:2}], R.unionMultisetBy([{id:1}],prop("id")));  // => [{id:1},{id:2}]
 * @data_last
 * @category Array
 */
export function unionMultisetBy<
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
): (data: ReadonlyArray<TData>) => [...Array<TData>, ...Array<TOther>];

export function unionMultisetBy() {
  return purry(unionMultisetByImplementation, arguments);
}

const unionMultisetByImplementation = <
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => TScalar
): [...Array<TData>, ...Array<TOther>] => [
  ...data,
  // A multi-set union is similar to an array concat, with the exception that
  // we need to remove items that are already in the first array. This is a copy
  // of the same code that implements `differenceMutltiset` - We do this to
  // avoid exporting the non-purried implementation function from that file.
  ..._reduceLazy(
    other,
    createLazyDifferenceMultisetByEvaluator(data, scalarFunction)
  ),
];

// TODO: Our `lazy` constructs currently don't support the notion of an "end"
// event that would allow us to dump all remaining items from the other array
// after we lazily iterate over the base array. Because of that we can't
// implement a lazy version of this function.
