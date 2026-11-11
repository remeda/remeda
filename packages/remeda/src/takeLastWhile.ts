import { dataLastImplementation1 } from "./internal/dataLastImplementation";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NarrowedArray } from "./internal/types/NarrowedArray";
import type { NonRefinedFilteredArray } from "./internal/types/NonRefinedFilteredArray";

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - A function to execute for each element in the array,
 * starting from the end. It should return `true` to keep taking elements, and
 * `false` to stop. A type-predicate can also be used to narrow the result.
 * @signature
 *    takeLastWhile(data, predicate)
 * @example
 *    takeLastWhile([1, 2, 10, 3, 4, 5], x => x < 10) // => [3, 4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLastWhile<T extends IterableContainer, Condition>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): NarrowedArray<T, Condition>;

export function takeLastWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - A function to execute for each element in the array,
 * starting from the end. It should return `true` to keep taking elements, and
 * `false` to stop. A type-predicate can also be used to narrow the result.
 * @signature
 *    takeLastWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 10, 3, 4, 5], takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T extends IterableContainer, Condition>(
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): (data: T) => NarrowedArray<T, Condition>;

export function takeLastWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function takeLastWhile(
  dataOrPredicate: unknown,
  predicate?: unknown,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLastImplementation1(
        takeLastWhileImplementation,
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrPredicate,
      )
    : takeLastWhileImplementation(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrPredicate,
        predicate,
      );
}

function takeLastWhileImplementation<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): T[number][] {
  for (let i = data.length - 1; i >= 0; i--) {
    if (!predicate(data[i], i, data)) {
      return data.slice(i + 1);
    }
  }
  return data.concat();
}
