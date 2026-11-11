import type { IterableContainer } from "./internal/types/IterableContainer";
import type { ReorderedArray } from "./internal/types/ReorderedArray";

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param data - The array to sort.
 * @param cmp - The comparator function.
 * @signature
 *    sort(items, cmp)
 * @example
 *    sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
 * @dataFirst
 * @category Array
 */
export function sort<T extends IterableContainer>(
  data: T,
  cmp: (a: T[number], b: T[number]) => number,
): ReorderedArray<T>;

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param cmp - The comparator function.
 * @signature
 *    sort(cmp)(items)
 * @example
 *    pipe([4, 2, 7, 5], sort((a, b) => a - b)) // => [2, 4, 5, 7]
 * @dataLast
 * @category Array
 */
export function sort<T extends IterableContainer>(
  cmp: (a: T[number], b: T[number]) => number,
): (data: T) => ReorderedArray<T>;

export function sort(dataOrCmp: unknown, cmp?: unknown): unknown {
  return typeof dataOrCmp === "function"
    ? dataLast(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrCmp,
      )
    : sortImplementation(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrCmp,
        cmp,
      );
}

const dataLast =
  (cmp: Parameters<typeof sortImplementation>[1]) =>
  (data: Parameters<typeof sortImplementation>[0]) =>
    sortImplementation(data, cmp);

function sortImplementation<T extends IterableContainer>(
  data: T,
  cmp: (a: T[number], b: T[number]) => number,
): ReorderedArray<T> {
  const ret = data.concat();
  ret.sort(cmp);
  return ret as ReorderedArray<T>;
}
