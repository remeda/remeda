import { purryFromLazy } from "./internal/purryFromLazy";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(data, keyFunction)
 * @example
 *    R.uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function uniqueBy<T, K>(
  data: ReadonlyArray<T>,
  keyFunction: (item: T, index: number, data: ReadonlyArray<T>) => K,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(keyFunction)(data)
 * @example
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniqueBy(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function uniqueBy<T, K>(
  keyFunction: (item: T, index: number, data: ReadonlyArray<T>) => K,
): (data: ReadonlyArray<T>) => Array<T>;

export function uniqueBy(...args: ReadonlyArray<unknown>): unknown {
  return purryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T, K>(
  keyFunction: (item: T, index: number, data: ReadonlyArray<T>) => K,
): LazyEvaluator<T> {
  const set = new Set<K>();
  return (value, index, data) => {
    const key = keyFunction(value, index, data);
    if (set.has(key)) {
      return SKIP_ITEM;
    }

    set.add(key);
    return { done: false, hasNext: true, next: value };
  };
}
