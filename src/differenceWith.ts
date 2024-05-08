import { purryFromLazy } from "./internal/purryFromLazy";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";

type IsEquals<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param array - The source array.
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    R.differenceWith(array, other, isEquals)
 * @example
 *    R.differenceWith(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 4}]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Array<TFirst>;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    R.differenceWith(other, isEquals)(array)
 * @example
 *    R.differenceWith(
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      R.equals,
 *    )([{a: 1}, {a: 2}, {a: 3}, {a: 4}]) // => [{a: 1}, {a: 4}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], // only 4 iterations
 *      R.differenceWith([{a: 2}, {a: 3}], R.equals),
 *      R.take(2),
 *    ) // => [{a: 1}, {a: 4}]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function differenceWith(...args: ReadonlyArray<unknown>): unknown {
  return purryFromLazy(lazyImplementation, args);
}

const lazyImplementation =
  <TFirst, TSecond>(
    other: ReadonlyArray<TSecond>,
    isEquals: IsEquals<TFirst, TSecond>,
  ): LazyEvaluator<TFirst> =>
  (value) =>
    other.every((otherValue) => !isEquals(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
