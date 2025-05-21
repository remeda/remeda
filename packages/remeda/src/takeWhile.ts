import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(data, predicate)
 * @example
 *    R.takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function takeWhile<T extends IterableContainer, S extends T[number]>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => item is S,
): Array<S>;
export function takeWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T extends IterableContainer, S extends T[number]>(
  predicate: (item: T[number], index: number, data: T) => item is S,
): (array: T) => Array<S>;
export function takeWhile<T extends IterableContainer>(
  predicate: (item: T[number], index: number, data: T) => boolean,
): (array: T) => Array<T[number]>;

export function takeWhile(...args: ReadonlyArray<unknown>): unknown {
  return purry(takeWhileImplementation, args);
}

function takeWhileImplementation<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]> {
  const ret: Array<T[number]> = [];
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
