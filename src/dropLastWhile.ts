import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropLastWhile(data, predicate)
 * @example
 *    R.dropLastWhile([1, 2, 10, 3, 4], x => x < 10) // => [1, 2, 10]
 * @dataFirst
 * @category Array
 */
export function dropLastWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]>;

/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropLastWhile(x => x < 10))  // => [1, 2, 10]
 * @dataLast
 * @category Array
 */
export function dropLastWhile<T extends IterableContainer>(
  predicate: (item: T[number], index: number, data: T) => boolean,
): (data: T) => Array<T[number]>;

export function dropLastWhile(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropLastWhileImplementation, args);
}

function dropLastWhileImplementation<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]> {
  for (let i = data.length - 1; i >= 0; i--) {
    if (!predicate(data[i], i, data)) {
      return data.slice(0, i + 1);
    }
  }
  return [];
}
