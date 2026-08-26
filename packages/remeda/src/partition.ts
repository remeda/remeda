import type { CommonSubtype } from "./internal/types/CommonSubtype";
import type { GuardType } from "./internal/types/GuardType";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
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
export function partition<
  T extends IterableContainer,
  Predicate extends (value: T[number], index: number, data: T) => boolean,
>(
  data: T,
  predicate: Predicate,
): [
  CommonSubtype<T[number], GuardType<Predicate, T[number]>>[],
  Exclude<T[number], GuardType<Predicate, T[number]>>[],
];

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
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
export function partition<
  T extends IterableContainer,
  Predicate extends (value: T[number], index: number, data: T) => boolean,
>(
  predicate: Predicate,
): (
  data: T,
) => [
  CommonSubtype<T[number], GuardType<Predicate, T[number]>>[],
  Exclude<T[number], GuardType<Predicate, T[number]>>[],
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
