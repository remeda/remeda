import { purryFromLazy } from "./internal/purryFromLazy";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param array - The array to filter.
 * @signature
 *    R.unique(array)
 * @example
 *    R.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @category Array
 * @lazy
 */
export function unique<T>(array: ReadonlyArray<T>): Array<T>;

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
 * @category Array
 * @lazy
 */
export function unique<T>(): (array: ReadonlyArray<T>) => Array<T>;

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
