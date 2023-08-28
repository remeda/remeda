/**
 * A helper utility function that implements the Lazy interface needed to
 * compute multi-set difference between 2 arrays. It was extracted out of the
 * functions themselves to allow re-use for union (which uses the same
 * algorithm without extracting out the unpurried versions)
 */
import type { LazyEvaluator } from './_reduceLazy';

const SKIP_VALUE = { done: false, hasNext: false } as const;

export function createLazyDifferenceMultiSetByEvaluator<
  TData,
  TOther = TData,
  TScalar = TData | TOther
>(
  other: ReadonlyArray<TOther>,
  scalarFunction?: (item: TData | TOther) => TScalar
): LazyEvaluator<TData> {
  // To perform a multi-set difference we need to "consume" a value from the
  // `other` array for each value in our source array. To keep track of this
  // we need to count how many "consumptions" we have for each value.
  const remaining = new Map<TScalar | TOther | TData, number>();
  for (const item of other) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const previousCount = remaining.get(scalar) ?? 0;
    remaining.set(scalar, previousCount + 1);
  }

  return item => {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const copies = remaining.get(scalar);
    if (copies === undefined || copies === 0) {
      // No more copies of the value left to "consume" so this item can be
      // returned.
      return { done: false, hasNext: true, next: item };
    }

    // We "consume" one copy of the value and then skip the item.
    remaining.set(scalar, copies - 1);
    return SKIP_VALUE;
  };
}
