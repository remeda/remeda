import { reduceLazy } from "./internal/reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Comparator<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param array - The source array.
 * @param other - The second array.
 * @param comparator - The custom comparator.
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
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  comparator: Comparator<TFirst, TSecond>,
): Array<TFirst>;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param other - The second array.
 * @param comparator - The custom comparator.
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
 * @dataLast
 * @pipeable
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  /**
   * Type inference doesn't work properly for the comparator's first parameter
   * in data last variant.
   */
  comparator: Comparator<TFirst, TSecond>,
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function intersectionWith(...args: ReadonlyArray<unknown>): unknown {
  return purry(intersectionWithImplementation, args, lazyImplementation);
}

const intersectionWithImplementation = <TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  comparator: Comparator<TFirst, TSecond>,
): Array<TFirst> => reduceLazy(array, lazyImplementation(other, comparator));

const lazyImplementation =
  <TFirst, TSecond>(
    other: ReadonlyArray<TSecond>,
    comparator: Comparator<TFirst, TSecond>,
  ): LazyEvaluator<TFirst> =>
  (value) =>
    other.some((otherValue) => comparator(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : { done: false, hasNext: false };
