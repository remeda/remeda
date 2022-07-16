import { purry } from './purry';
import { LazyResult, _reduceLazy } from './_reduceLazy';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Excludes the values from `other` array.
 * @param array the source array
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *    R.differenceWith(array, other, isEquals)
 * @example
 *    R.differenceWith([1, 2, 3, 4], [2, 5, 3], R.equals) // => [1, 4]
 * @data_first
 * @category Array
 * @pipeable
 */
export function differenceWith<T>(
  array: readonly T[],
  other: readonly T[],
  isEquals: IsEquals<T>
): T[];

/**
 * Excludes the values from `other` array.
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *    R.differenceWith(other, isEquals)(array)
 * @example
 *    R.differenceWith([2, 5, 3], R.equals)([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 3, 4, 5, 6], // only 4 iterations
 *      R.differenceWith([2, 3], R.equals),
 *      R.take(2)
 *    ) // => [1, 4]
 * @data_last
 * @category Array
 * @pipeable
 */
export function differenceWith<T, K>(
  other: readonly T[],
  isEquals: IsEquals<T>
): (array: readonly K[]) => T[];

export function differenceWith() {
  return purry(_differenceWith, arguments, differenceWith.lazy);
}

function _differenceWith<T>(array: T[], other: T[], isEquals: IsEquals<T>) {
  const lazy = differenceWith.lazy(other, isEquals);
  return _reduceLazy(array, lazy);
}

export namespace differenceWith {
  export function lazy<T>(other: T[], isEquals: IsEquals<T>) {
    return (value: T): LazyResult<T> => {
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
