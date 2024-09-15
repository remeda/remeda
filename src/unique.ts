import { purryFromLazy } from "./internal/purryFromLazy";
import type { Deduped, IterableContainer } from "./internal/types";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    R.unique(array)
 * @example
 *    R.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
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
 *    R.unique()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.unique(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;

export function unique(...args: ReadonlyArray<unknown>): unknown {
  return purryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T>(): LazyEvaluator<T> {
  const set = new Set<T>();
  return (value) => {
    if (set.has(value)) {
      return SKIP_ITEM;
    }
    set.add(value);
    return { done: false, hasNext: true, next: value };
  };
}
