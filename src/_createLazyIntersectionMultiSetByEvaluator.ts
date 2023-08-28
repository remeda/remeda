/**
 * A helper utility function that implements the Lazy interface needed to
 * compute multi-set intersection between 2 arrays. It was extracted out of the
 * functions themselves to allow re-use.
 */
import type { LazyEvaluator } from './_reduceLazy';

export const SKIP_VALUE = { done: false, hasNext: false } as const;

export function createLazyIntersectionMultiSetByEvaluator<
  TData,
  TOther = TData
>(
  other: ReadonlyArray<TOther>,
  scalarFunction?: (item: TData | TOther) => unknown
): LazyEvaluator<TData> {
  // To perform a multi-set difference we need to "consume" a value from the
  // `other` array for each value in our source array. To keep track of this
  // we need to count how many "consumptions" we have for each value.
  const remaining = new Map<unknown, number>();
  for (const item of other) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const previousCount = remaining.get(scalar) ?? 0;
    remaining.set(scalar, previousCount + 1);
  }

  return item => {
    if (remaining.size === 0) {
      // This case is only relevant if the `other` array was empty to begin
      // with. It will stop the iteration.
      return { done: true, hasNext: false };
    }

    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const copies = remaining.get(scalar);

    if (copies === undefined) {
      // This item didn't have a matching item in the `other` array so it is
      // skipped. We continue the iteration because there are still items in the
      // `other` array we can consume.
      return SKIP_VALUE;
    }

    if (copies > 1) {
      // We "consume" a copy from the `other` array and continue.
      remaining.set(scalar, copies - 1);
    } else {
      // We don't want the counter to reach 0 because we rely on the whole map
      // emptying as a trigger to stop the iteration.
      remaining.delete(scalar);
    }

    return {
      done: remaining.size === 0,
      hasNext: true,
      next: item,
    };
  };
}
