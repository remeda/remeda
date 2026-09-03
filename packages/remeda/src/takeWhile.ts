import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Narrowed } from "./internal/types/Narrowed";
import { purry } from "./purry";

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - Executed on each item of `data` until it returns `false`.
 * If provided a type-predicate the result would also be narrowed.
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
): Narrowed<T[number], Condition>[];

export function takeWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): T[number][];

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - Executed on each item of `data` until it returns `false`.
 * If provided a type-predicate the result would also be narrowed.
 * @signature
 *    takeWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): (data: T) => Narrowed<T[number], Condition>[];

export function takeWhile<T extends IterableContainer>(
  predicate: (item: T[number], index: number, data: T) => boolean,
): (data: T) => T[number][];

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
