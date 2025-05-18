import type { IsEqual, Writable } from "type-fest";
import type { FilteredArray } from "./internal/types/FilteredArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import { purry } from "./purry";

// When the predicate used for filter isn't refining (like a type-predicate) we
// can narrow the result slightly if it's also trivial (it returns the same
// result for all items). This is uncommon, but can be useful to "short-circuit"
// the filter.
type NonRefinedFilteredArray<T extends IterableContainer, B extends boolean> =
  IsEqual<B, true> extends true
    ? // If the predicate is always true we return a shallow copy of the array.
      // If it was originally readonly we need to strip that away.
      Writable<T>
    : IsEqual<B, false> extends true
      ? // If the predicate is always false we will always return an empty
        // array.
        []
      : // These are the cases where we have the least to work with when
        // computing the result type. We don't know which items of the array
        // would participate in the output and which wouldn't so we can only
        // safely say that the result is an array with items from the input
        // array.
        Array<T[number]>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(data, predicate)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function filter<
  T extends IterableContainer,
  Condition extends T[number],
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): FilteredArray<T, Condition>;
export function filter<T extends IterableContainer, B extends boolean>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => B,
): NonRefinedFilteredArray<T, B>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function filter<
  T extends IterableContainer,
  Condition extends T[number],
>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => FilteredArray<T, Condition>;
export function filter<T extends IterableContainer, B extends boolean>(
  predicate: (value: T[number], index: number, data: T) => B,
): (data: T) => NonRefinedFilteredArray<T, B>;

export function filter(...args: ReadonlyArray<unknown>): unknown {
  return purry(filterImplementation, args, lazyImplementation);
}

const filterImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T> => data.filter(predicate);

const lazyImplementation =
  <T>(
    predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
  ): LazyEvaluator<T> =>
  (value, index, data) =>
    predicate(value, index, data)
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
