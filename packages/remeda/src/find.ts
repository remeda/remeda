// TODO: find's return type could be refined to remove the `undefined` when we know that a matching item exists in the data (find is a more runtime efficient version of `first(filter(data, predicate))` which provides stricter typing).

import { toSingle } from "./internal/toSingle";
import type { CommonSubtype } from "./internal/types/CommonSubtype";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
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
 *    find(data, predicate)
 * @example
 *    find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @lazy
 * @category Array
 */
export function find<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): CommonSubtype<T[number], Condition> | undefined;

export function find<T extends IterableContainer>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => boolean,
): T[number] | undefined;

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
 *    find(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @lazy
 * @category Array
 */
export function find<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => CommonSubtype<T[number], Condition> | undefined;

export function find<T extends IterableContainer>(
  predicate: (value: T[number], index: number, data: T) => boolean,
): (data: T) => T[number] | undefined;

export function find(...args: readonly unknown[]): unknown {
  return purry(findImplementation, args, toSingle(lazyImplementation));
}

const findImplementation = <T, S extends T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => value is S,
): S | undefined => data.find(predicate);

const lazyImplementation =
  <T, S extends T>(
    predicate: (value: T, index: number, data: readonly T[]) => value is S,
  ): LazyEvaluator<T, S> =>
  (value, index, data) =>
    predicate(value, index, data)
      ? { done: true, hasNext: true, next: value }
      : SKIP_ITEM;
