import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import doTransduce from "./internal/doTransduce";
import { mapCallback } from "./internal/utilityEvaluators";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(data, predicate)
 * @example
 *    R.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]>;

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  predicate: (item: T[number], index: number, data: T) => boolean,
): (data: T) => Array<T[number]>;

export function dropWhile(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(dropWhileImplementation, lazyImplemention, args);
}

function dropWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Array<T> {
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
  }
  return [];
}

function* lazyImplemention<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Iterable<T> {
  let dropping = true;
  for (const [item, flag] of mapCallback(data, (itemArg, index, dataArg) => {
    if (!dropping) {
      return false;
    }
    if (!predicate(itemArg, index, dataArg)) {
      dropping = false;
      return false;
    }
    return true;
  })) {
    if (!flag) {
      yield item;
    }
  }
}
