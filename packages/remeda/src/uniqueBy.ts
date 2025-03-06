import doTransduce from "./internal/doTransduce";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Deduped } from "./internal/types/Deduped";
import { mapCallback } from "./internal/utilityEvaluators";

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
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends Iterable<unknown>>(
  data: T,
  keyFunction: ArrayMethodCallback<T>,
): Deduped<T>;

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
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends Iterable<unknown>>(
  keyFunction: ArrayMethodCallback<T>,
): (data: T) => Deduped<T>;

export function uniqueBy(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  keyFunction: (item: T, index: number, data: ReadonlyArray<T>) => unknown,
): Iterable<T> {
  const set = new Set<unknown>();
  for (const [value, key] of mapCallback(data, keyFunction)) {
    if (set.has(key)) {
      continue;
    }
    set.add(key);
    yield value;
  }
}
