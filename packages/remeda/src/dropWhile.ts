import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import { requireDataByArity } from "./internal/requireData";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(data, predicate)
 * @example
 *    dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): T[number][];

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 10, 3, 4], dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  predicate: LazyCallback<T, boolean>,
): (data: T) => T[number][];

export function dropWhile(...args: readonly unknown[]): unknown {
  return purryWithLazy(dropWhileImplementation, args, lazyImplementation);
}

function dropWhileImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): T[] {
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
  }
  return [];
}

function lazyImplementation<T>(
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): LazyEvaluator<T> {
  let isDropping = true;
  return requireDataByArity(predicate, (item, index, data) => {
    if (isDropping && predicate(item, index, data)) {
      return SKIP_ITEM;
    }

    isDropping = false;
    return item;
  });
}
