import type { LazyEvaluator } from './_reduceLazy';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

const SKIP_VALUE = { done: false, hasNext: false } as const;

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
) => _reduceLazy(data, differenceMultisetBy.lazy(other, scalarFunction));

export namespace differenceMultisetBy {
  export function lazy<TData, TOther = TData, TScalar = TData | TOther>(
    other: ReadonlyArray<TOther>,
    scalarFunction: (item: TData | TOther) => TScalar
  ): LazyEvaluator<TData> {
    // To perform a multi-set difference we need to "consume" a value from the
    // `other` array for each value in our source array. To keep track of this
    // we need to count how many "consumptions" we have for each value.
    const remaining = new Map<TScalar, number>();
    for (const item of other) {
      const scalar = scalarFunction(item);
      const previousCount = remaining.get(scalar) ?? 0;
      remaining.set(scalar, previousCount + 1);
    }

    return value => {
      const scalar = scalarFunction(value);
      const copies = remaining.get(scalar);
      if (copies === undefined || copies === 0) {
        // No more copies of the value left to "consume" so this item can be
        // returned.
        return { done: false, hasNext: true, next: value };
      }

      // We "consume" one copy of the value and then skip the item.
      remaining.set(scalar, copies - 1);
      return SKIP_VALUE;
    };
  }
}
