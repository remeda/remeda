import { purryFromLazy } from "./internal/purryFromLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { SKIP_ITEM } from "./internal/utilityEvaluators";

type IsEqual<T, Other> = (data: T, other: Other) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param data - The source array.
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    R.differenceWith(data, other, isEqual)
 * @example
 *    R.differenceWith(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }],
 *      [2, 5, 3],
 *      ({ a }, b) => a === b,
 *    ); //=> [{ a: 1 }, { a: 4 }]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  data: readonly T[],
  other: readonly Other[],
  isEqual: IsEqual<T, Other>,
): T[];

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    R.differenceWith(other, isEqual)(data)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
 *      R.differenceWith([2, 3], ({ a }, b) => a === b),
 *    ); //=> [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 6 }]
 * @dataLast
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  other: readonly Other[],
  isEqual: IsEqual<T, Other>,
): (data: readonly T[]) => T[];

export function differenceWith(...args: readonly unknown[]): unknown {
  return purryFromLazy(lazyImplementation, args);
}

const lazyImplementation =
  <T, Other>(
    other: readonly Other[],
    isEqual: IsEqual<T, Other>,
  ): LazyEvaluator<T> =>
  (value) =>
    other.every((otherValue) => !isEqual(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
