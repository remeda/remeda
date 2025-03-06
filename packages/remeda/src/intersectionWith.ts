import doTransduce from "./internal/doTransduce";

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
 * @lazy
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  array: Iterable<TFirst>,
  other: Iterable<TSecond>,
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
 * @lazy
 * @category Array
 */
export function intersectionWith<TFirst, TSecond>(
  other: Iterable<TSecond>,
  /**
   * Type inference doesn't work properly for the comparator's first parameter
   * in data last variant.
   */
  comparator: Comparator<TFirst, TSecond>,
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function intersectionWith(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<TFirst, TSecond>(
  data: Iterable<TFirst>,
  other: Iterable<TSecond>,
  comparator: Comparator<TFirst, TSecond>,
): Iterable<TFirst> {
  for (const value of data) {
    for (const otherValue of other) {
      if (comparator(value, otherValue)) {
        yield value;
        break;
      }
    }
  }
}
