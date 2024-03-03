import { purry } from "./purry";
import type { LazyResult } from "./_reduceLazy";
import { _reduceLazy } from "./_reduceLazy";

type IsEquals<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 * @param array the source array
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *    R.differenceWith(array, other, isEquals)
 * @example
 *    R.differenceWith(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 4}]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function differenceWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Array<TFirst>;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 * @param other the values to exclude
 * @param isEquals the comparator
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
 * @category Array
 * @pipeable
 */
export function differenceWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function differenceWith() {
  return purry(_differenceWith, arguments, differenceWith.lazy);
}

function _differenceWith<TFirst, TSecond>(
  array: Array<TFirst>,
  other: Array<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
) {
  const lazy = differenceWith.lazy(other, isEquals);
  return _reduceLazy(array, lazy);
}

export namespace differenceWith {
  export function lazy<TFirst, TSecond>(
    other: Array<TSecond>,
    isEquals: IsEquals<TFirst, TSecond>,
  ) {
    return (value: TFirst): LazyResult<TFirst> => {
      if (other.every((otherValue) => !isEquals(value, otherValue))) {
        return {
          done: false,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  }
}
