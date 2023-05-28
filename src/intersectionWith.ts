import { LazyResult, _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

type Comparator<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 * @param array the source array
 * @param other the second array
 * @param comparator the custom comparator
 * @signature
 *    R.intersectionWith(array, other, comparator)
 * @example
 *    R.intersectionWith(
 *      [
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ],
 *      [3, 5],
 *      (a, b) => a.id === b,
 *    ) // => [{ id: 3, name: 'Emma' }]
 * @data_first
 * @category Array
 * @pipeable
 */
export function intersectionWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  comparator: Comparator<TFirst, TSecond>
): Array<TFirst>;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 * @param other the second array
 * @param comparator the custom comparator
 * @signature
 *    R.intersectionWith(other, comparator)(array)
 * @example
 *    R.intersectionWith(
 *      [3, 5],
 *      (a, b) => a.id === b
 *      )([
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ]); // => [{ id: 3, name: 'Emma' }]
 * @data_last
 * @category Array
 * @pipeable
 */
export function intersectionWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  /**
   * type inference doesn't work properly for the comparator's first parameter
   * in data last variant
   */
  comparator: Comparator<TFirst, TSecond>
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function intersectionWith() {
  return purry(_intersectionWith, arguments, intersectionWith.lazy);
}

function _intersectionWith<TFirst, TSecond>(
  array: Array<TFirst>,
  other: Array<TSecond>,
  comparator: Comparator<TFirst, TSecond>
) {
  const lazy = intersectionWith.lazy(other, comparator);
  return _reduceLazy(array, lazy);
}

export namespace intersectionWith {
  export function lazy<TFirst, TSecond>(
    other: Array<TSecond>,
    comparator: Comparator<TFirst, TSecond>
  ) {
    return (value: TFirst): LazyResult<TFirst> => {
      if (other.some(otherValue => comparator(value, otherValue))) {
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
