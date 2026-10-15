import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import { requireDataByArity } from "./internal/requireData";
import type { Deduped } from "./internal/types/Deduped";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    uniqueBy(data, keyFunction)
 * @example
 *    uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends IterableContainer>(
  data: T,
  keyFunction: (value: T[number], index: number, data: Readonly<T>) => unknown,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    uniqueBy(keyFunction)(data)
 * @example
 *    pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      uniqueBy(obj => obj.n),
 *      take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends IterableContainer>(
  keyFunction: LazyCallback<T, unknown>,
): (data: T) => Deduped<T>;

export function uniqueBy(...args: readonly unknown[]): unknown {
  return purryWithLazy(uniqueByImplementation, args, lazyImplementation);
}

function uniqueByImplementation<T>(
  data: readonly T[],
  keyFunction: (value: T, index: number, data: readonly T[]) => unknown,
): T[] {
  const seenKeys = new Set<unknown>();

  const result: T[] = [];
  let index = 0;
  for (const value of data) {
    const key = keyFunction(value, index, data);
    // `add` leaves the set unchanged for a key it already holds, so the size
    // tells duplicates apart with a single hash lookup per item.
    const sizeBefore = seenKeys.size;
    seenKeys.add(key);
    if (seenKeys.size > sizeBefore) {
      result.push(value);
    }
    index += 1;
  }

  return result;
}

function lazyImplementation<T>(
  keyFunction: (item: T, index: number, data: readonly T[]) => unknown,
): LazyEvaluator<T> {
  const seenKeys = new Set<unknown>();

  return requireDataByArity(keyFunction, (value, index, data) => {
    const key = keyFunction(value, index, data);
    // `add` leaves the set unchanged for a key it already holds, so the size
    // tells duplicates apart with a single hash lookup per item.
    const sizeBefore = seenKeys.size;
    seenKeys.add(key);
    return seenKeys.size === sizeBefore ? SKIP_ITEM : value;
  });
}
