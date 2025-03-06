import doReduce from "./internal/doReduce";
import { mapCallback } from "./internal/utilityEvaluators";
import { isArray } from "./isArray";

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
 * @lazy
 * @category Array
 */
export function find<T, S extends T>(
  data: Iterable<T>,
  predicate: (value: T, index: number, data: Iterable<T>) => value is S,
): S | undefined;
export function find<T>(
  data: Iterable<T>,
  predicate: (value: T, index: number, data: Iterable<T>) => boolean,
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
 * @lazy
 * @category Array
 */
export function find<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: Iterable<T>) => S | undefined;
export function find<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: Iterable<T>) => T | undefined;

export function find(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(findImplementation, args);
}

function findImplementation<T>(
  data: Iterable<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): T | undefined {
  if (isArray(data)) {
    return data.find(predicate);
  }
  for (const [value, flag] of mapCallback(data, predicate)) {
    if (flag) {
      return value;
    }
  }
  return undefined;
}
