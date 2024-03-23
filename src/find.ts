import { _toSingle } from "./_toSingle";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(data, predicate)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function find<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined;
export function find<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): T | undefined;

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @pipeable
 * @category Array
 */
export function find<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => S | undefined;
export function find<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => T | undefined;

export function find(...args: ReadonlyArray<unknown>): unknown {
  return purry(findImplementation, args, _toSingle(lazyImplementation));
}

const findImplementation = <T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined => data.find(predicate);

const lazyImplementation =
  <T, S extends T>(
    predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
  ): LazyEvaluator<T, S> =>
  (value, index, data) =>
    predicate(value, index, data)
      ? { done: true, hasNext: true, next: value }
      : { done: false, hasNext: false };
