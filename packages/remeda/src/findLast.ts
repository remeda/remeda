import { purry } from "./purry";

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(data, predicate)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 * @dataFirst
 * @category Array
 */
export function findLast<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined;
export function findLast<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): T | undefined;

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast(n => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @category Array
 */
export function findLast<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => S | undefined;
export function findLast<T = never>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => T | undefined;

export function findLast(...args: ReadonlyArray<unknown>): unknown {
  return purry(findLastImplementation, args);
}

const findLastImplementation = <T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined => {
  // TODO [2025-08-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLast` here.

  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i]!;
    if (predicate(item, i, data)) {
      return item;
    }
  }

  return undefined;
};
