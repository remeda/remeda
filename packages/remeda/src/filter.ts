import type { FilteredArray } from "./internal/types/FilteredArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { NonRefinedFilteredArray } from "./internal/types/NonRefinedFilteredArray";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import { purry } from "./purry";

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * Related operations:
 * - `splice` - to shape the array by *position* rather than by *value*.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    filter(data, predicate)
 * @example
 *    filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function filter<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): FilteredArray<T, Condition>;
export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * Related operations:
 * - `splice` - to shape the array by *position* rather than by *value*.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    filter(predicate)(data)
 * @example
 *    pipe([1, 2, 3], filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function filter<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => FilteredArray<T, Condition>;
export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function filter(...args: readonly unknown[]): unknown {
  return purry(filterImplementation, args, lazyImplementation);
}

const filterImplementation = <T>(
  data: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
): T[] => data.filter(predicate);

const lazyImplementation =
  <T>(
    predicate: (value: T, index: number, data: readonly T[]) => boolean,
  ): LazyEvaluator<T> =>
  (value, index, data) =>
    predicate(value, index, data)
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
