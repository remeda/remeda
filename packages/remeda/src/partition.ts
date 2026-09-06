import type { FilteredArray } from "./internal/types/FilteredArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NonRefinedFilteredArray } from "./internal/types/NonRefinedFilteredArray";
import { purry } from "./purry";

// Does what it says on the tin...
type Not<T extends boolean> = T extends true ? false : true;

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and `false`
 * to add the element to the other partition. A type-predicate can also be used
 * to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    partition(data, predicate)
 * @example
 *    partition(
 *      ['one', 'two', 'forty two'],
 *      x => x.length === 3,
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @category Array
 */
export function partition<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): [
  FilteredArray<T, Condition>,
  FilteredArray<T, Condition, true /* IsNegated */>,
];

export function partition<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): [
  NonRefinedFilteredArray<T, IsItemIncluded>,
  NonRefinedFilteredArray<T, Not<IsItemIncluded>>,
];

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and `false`
 * to add the element to the other partition. A type-predicate can also be used
 * to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    partition(predicate)(data)
 * @example
 *    pipe(
 *      ['one', 'two', 'forty two'],
 *      partition(x => x.length === 3),
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
export function partition<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (
  data: T,
) => [
  FilteredArray<T, Condition>,
  FilteredArray<T, Condition, true /* IsNegated */>,
];

export function partition<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): (
  data: T,
) => [
  NonRefinedFilteredArray<T, IsItemIncluded>,
  NonRefinedFilteredArray<T, Not<IsItemIncluded>>,
];

export function partition(...args: readonly unknown[]): unknown {
  return purry(partitionImplementation, args);
}

const partitionImplementation = <T, S extends T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => value is S,
): [S[], T[]] => {
  const ret: [S[], T[]] = [[], []];
  for (const [index, item] of data.entries()) {
    if (predicate(item, index, data)) {
      ret[0].push(item);
    } else {
      ret[1].push(item);
    }
  }
  return ret;
};
