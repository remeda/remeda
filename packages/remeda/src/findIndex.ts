import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";

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
 *    findIndex(data, predicate)
 * @example
 *    findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @category Array
 */
export function findIndex<T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => boolean,
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
 *    findIndex(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @category Array
 */
export function findIndex<T>(
  predicate: (value: T, index: number, data: readonly T[]) => boolean,
): (data: readonly T[]) => number;

export function findIndex(
  dataOrPredicate:
    readonly unknown[] | ArrayCallback<readonly unknown[], boolean>,
  predicate?: ArrayCallback<readonly unknown[], boolean>,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLast(dataOrPredicate)
    : findIndexImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof findIndexImplementation> =
  (predicate) => (data) =>
    findIndexImplementation(data, predicate);

const findIndexImplementation = <T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => boolean,
): number => data.findIndex(predicate);
