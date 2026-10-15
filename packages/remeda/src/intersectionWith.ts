import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

type IsEqual<T, S> = (a: T, b: S) => boolean;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param data - The source data.
 * @param other - The other data.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(data, other, isEqual)
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
export function intersectionWith<T, S>(
  data: readonly T[],
  other: readonly S[],
  isEqual: IsEqual<T, S>,
): T[];

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param other - The other data.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(other, isEqual)(data)
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
export function intersectionWith<T, S>(
  other: readonly S[],
  /**
   * Type inference doesn't work properly for the comparator's first parameter
   * in data last variant.
   */
  isEqual: IsEqual<T, S>,
): (data: readonly T[]) => T[];

export function intersectionWith(...args: readonly unknown[]): unknown {
  return purryWithLazy(
    intersectionWithImplementation,
    args,
    lazyImplementation,
  );
}

function intersectionWithImplementation<T, S>(
  data: readonly T[],
  other: readonly S[],
  isEqual: IsEqual<T, S>,
): T[] {
  const result: T[] = [];
  for (const value of data) {
    if (other.some((otherValue) => isEqual(value, otherValue))) {
      result.push(value);
    }
  }

  return result;
}

const lazyImplementation =
  <T, S>(other: readonly S[], isEqual: IsEqual<T, S>): LazyEvaluator<T> =>
  (value) =>
    other.some((otherValue) => isEqual(value, otherValue)) ? value : SKIP_ITEM;
