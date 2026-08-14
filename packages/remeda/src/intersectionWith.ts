import { purryFromLazy } from "./internal/purryFromLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { SKIP_ITEM } from "./internal/utilityEvaluators";

type IsEqual<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param array - The source array.
 * @param other - The second array.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(array, other, comparator)
 * @example
 *    intersectionWith(
 *      [
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ],
 *      [3, 5],
 *      (a, b) => a.id === b,
 *    ) // => [{ id: 3, name: 'Emma' }]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  array: readonly TFirst[],
  other: readonly TSecond[],
  isEqual: IsEqual<TFirst, TSecond>,
): TFirst[];

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param other - The second array.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(other, isEqual)(array)
 * @example
 *    intersectionWith(
 *      [3, 5],
 *      (a, b) => a.id === b
 *      )([
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ]); // => [{ id: 3, name: 'Emma' }]
 * @dataLast
 * @lazy
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  other: readonly TSecond[],
  /**
   * Type inference doesn't work properly for the comparator's first parameter
   * in data last variant.
   */
  isEqual: IsEqual<TFirst, TSecond>,
): (array: readonly TFirst[]) => TFirst[];

export function intersectionWith(...args: readonly unknown[]): unknown {
  return purryFromLazy(lazyImplementation, args);
}

const lazyImplementation =
  <TFirst, TSecond>(
    other: readonly TSecond[],
    isEqual: IsEqual<TFirst, TSecond>,
  ): LazyEvaluator<TFirst> =>
  (value) =>
    other.some((otherValue) => isEqual(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
