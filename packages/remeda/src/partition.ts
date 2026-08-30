// TODO: partition's return type could be refined to also take the *shape* of `data` into account when computing the output partitions (partition is a more runtime efficient version of `[filter(data, predicate), filter(data, isNot(predicate))]` which provides stricter typing).

import type { CommonSubtype } from "./internal/types/CommonSubtype";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

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
): [CommonSubtype<T[number], Condition>[], Exclude<T[number], Condition>[]];

export function partition<T extends IterableContainer>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => boolean,
): [T[number][], T[number][]];

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
) => [CommonSubtype<T[number], Condition>[], Exclude<T[number], Condition>[]];

export function partition<T extends IterableContainer>(
  predicate: (value: T[number], index: number, data: T) => boolean,
): (data: T) => [T[number][], T[number][]];

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
