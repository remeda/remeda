import type { CommonSubtype } from "./internal/types/CommonSubtype";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - A function to execute for the elements in the array. It
 * should return `true` to indicate elements that should remain in the output,
 * and `false` otherwise. A type-predicate can also be used to narrow the
 * result.
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
): CommonSubtype<T[number], Condition>[];

export function takeLastWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): T[number][];

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - A function to execute for the elements in the array. It
 * should return `true` to indicate elements that should remain in the output,
 * and `false` otherwise. A type-predicate can also be used to narrow the
 * result.
 * @signature
 *    takeLastWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 10, 3, 4, 5], takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T extends IterableContainer, Condition>(
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): (data: T) => CommonSubtype<T[number], Condition>[];

export function takeLastWhile<T extends IterableContainer>(
  predicate: (item: T[number], index: number, data: T) => boolean,
): (data: T) => T[number][];

export function takeLastWhile(...args: readonly unknown[]): unknown {
  return purry(takeLastWhileImplementation, args);
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
  return [...data];
}
