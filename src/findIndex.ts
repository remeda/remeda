import { purry } from "./purry";

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(data, predicate)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @category Array
 */
export function findIndex<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number;

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @category Array
 */
export function findIndex<T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => number;

export function findIndex(): unknown {
  return purry(findIndexImplementation, arguments);
}

const findIndexImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number => data.findIndex(predicate);
