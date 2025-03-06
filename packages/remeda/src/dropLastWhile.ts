import type { IterableElement } from "type-fest";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
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
export function dropLastWhile<T extends Iterable<unknown>>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): Array<IterableElement<T>>;

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
export function dropLastWhile<T extends Iterable<unknown>>(
  predicate: ArrayMethodCallback<T, boolean>,
): (data: T) => Array<IterableElement<T>>;

export function dropLastWhile(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropLastWhileImplementation, args);
}

function dropLastWhileImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Array<T> {
  const array = toReadonlyArray(data);
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!, i, array)) {
      return array.slice(0, i + 1);
    }
  }
  return [];
}
