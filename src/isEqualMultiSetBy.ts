import { _isEqualMultiSetImplementation } from './_isEqualMultiSetImplementation';
import { purry } from './purry';

/**
 * Compare two arrays for item equality, disregarding order, using *multi-set*
 * (or "bag") semantics. Arrays are equal if they have the same number of copies
 * of each item.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * This function doesn't provide a comparer between items, if you need more
 * control over the comparison, check out `equals`.
 *
 * @param data - The base array.
 * @param other - The array to compare against.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.isEqualMultiSetBy(data, other, scalarFunction)
 * @example
 *   R.isEqualMultiSetBy([{id:1},{id:2},{id:3}], [{id:2},{id:3},{id:1}], prop('id')) // => true
 * @data_first
 * @category Array
 */
export function isEqualMultiSetBy<TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): boolean;

/**
 * Compare two arrays for item equality, disregarding order, using *multi-set*
 * (or "bag") semantics. Arrays are equal if they have the same number of copies
 * of each item.
 *
 * The function takes a `scalarFunction` that computes the value used to
 * determine item identity. This could be used to extract an identity property
 * to avoid using object reference equality.
 *
 * This function doesn't provide a comparer between items, if you need more
 * control over the comparison, check out `equals`.
 *
 * @param data - The base array.
 * @param other - The array to compare against.
 * @param scalarFunction - A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.isEqualMultiSetBy(other, scalarFunction)(data)
 * @example
 *   R.pipe([{id:1},{id:2},{id:3}], R.isEqualMultiSetBy([{id:2},{id:3},{id:1}], prop('id'))) // => true
 * @data_last
 * @category Array
 */
export function isEqualMultiSetBy<TData, TOther>(
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): (data: ReadonlyArray<TData>) => boolean;

export function isEqualMultiSetBy() {
  return purry(isEqualMultiSetImplementationBy, arguments);
}

const isEqualMultiSetImplementationBy = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (item: TData | TOther) => unknown
): boolean => _isEqualMultiSetImplementation(data, other, scalarFunction);
