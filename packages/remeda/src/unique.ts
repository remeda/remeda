import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import type { Deduped } from "./internal/types/Deduped";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    unique(array)
 * @example
 *    unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function unique<T extends IterableContainer>(data: T): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *    unique()(array)
 * @example
 *    pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      unique(),
 *      take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;

export function unique(...args: readonly unknown[]): unknown {
  return purryWithLazy(uniqueImplementation, args, lazyImplementation);
}

function uniqueImplementation<T>(data: readonly T[]): T[] {
  // The items are collected from `data` rather than spread out of the set,
  // which would turn a `-0` into `0`.
  const seen = new Set<T>();
  const result: T[] = [];
  for (const value of data) {
    // `add` leaves the set unchanged for a value it already holds, so the size
    // tells duplicates apart with a single hash lookup per item.
    const sizeBefore = seen.size;
    seen.add(value);
    if (seen.size > sizeBefore) {
      result.push(value);
    }
  }
  return result;
}

function lazyImplementation<T>(): LazyEvaluator<T> {
  const set = new Set<T>();
  return (value) => {
    // `add` leaves the set unchanged for a value it already holds, so the size
    // tells duplicates apart with a single hash lookup per item.
    const sizeBefore = set.size;
    set.add(value);
    return set.size === sizeBefore ? SKIP_ITEM : value;
  };
}
