import doTransduce from "./internal/doTransduce";
import { memoizeIterable } from "./internal/memoizeIterable";

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
 * @lazy
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  array: Iterable<TFirst>,
  other: Iterable<TSecond>,
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
 * @lazy
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  other: Iterable<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): (array: Iterable<TFirst>) => Array<TFirst>;

export function differenceWith(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<TFirst, TSecond>(
  data: Iterable<TFirst>,
  other: Iterable<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Iterable<TFirst> {
  other = memoizeIterable(other);
  for (const value of data) {
    let anyEqual = false;
    for (const otherValue of other) {
      if (isEquals(value, otherValue)) {
        anyEqual = true;
        break;
      }
    }
    if (!anyEqual) {
      yield value;
    }
  }
}
