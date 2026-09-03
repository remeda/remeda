import type { CoercedArray } from "./internal/types/CoercedArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Narrowed } from "./internal/types/Narrowed";
import type { NonRefinedFilteredArray } from "./internal/types/NonRefinedFilteredArray";
import { purry } from "./purry";

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(data, predicate)
 * @example
 *    takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): CoercedArray<Narrowed<T[number], Condition>>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): (data: T) => CoercedArray<Narrowed<T[number], Condition>>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function takeWhile(...args: readonly unknown[]): unknown {
  return purry(takeWhileImplementation, args);
}

function takeWhileImplementation<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): T[number][] {
  const ret: T[number][] = [];
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
