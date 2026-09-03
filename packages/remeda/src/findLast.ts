// TODO: findLast's return type could be refined to remove the `undefined` when we know that a matching item exists in the data (findLast is a more runtime efficient version of `last(filter(data, predicate))` which provides stricter typing).

import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Narrowed } from "./internal/types/Narrowed";
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
 *    findLast(data, predicate)
 * @example
 *    findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 * @dataFirst
 * @category Array
 */
export function findLast<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): Narrowed<T[number], Condition> | undefined;

export function findLast<T extends IterableContainer>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => boolean,
): T[number] | undefined;

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
 *    findLast(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      findLast(n => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @category Array
 */
export function findLast<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => Narrowed<T[number], Condition> | undefined;

export function findLast<T extends IterableContainer>(
  predicate: (value: T[number], index: number, data: T) => boolean,
): (data: T) => T[number] | undefined;

export function findLast(...args: readonly unknown[]): unknown {
  return purry(findLastImplementation, args);
}

const findLastImplementation = <T, S extends T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => value is S,
): S | undefined => {
  // TODO [>2]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLast` here.

  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i]!;
    if (predicate(item, i, data)) {
      return item;
    }
  }

  return undefined;
};
