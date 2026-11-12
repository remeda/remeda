import type { CompareFunction } from "./internal/types/CompareFunction";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { ReorderedArray } from "./internal/types/ReorderedArray";

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param data - The array to sort.
 * @param comparator - The comparator function.
 * @signature
 *    sort(data, comparator)
 * @example
 *    sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
 * @dataFirst
 * @category Array
 */
export function sort<T extends IterableContainer>(
  data: T,
  comparator: CompareFunction<T[number]>,
): ReorderedArray<T>;

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param comparator - The comparator function.
 * @signature
 *    sort(comparator)(data)
 * @example
 *    pipe([4, 2, 7, 5], sort((a, b) => a - b)) // => [2, 4, 5, 7]
 * @dataLast
 * @category Array
 */
export function sort<T extends IterableContainer>(
  comparator: CompareFunction<T[number]>,
): (data: T) => ReorderedArray<T>;

export function sort(
  dataOrComparator: IterableContainer | CompareFunction,
  comparator?: CompareFunction,
): unknown {
  return typeof dataOrComparator === "function"
    ? dataLast(dataOrComparator)
    : sortImplementation(
        dataOrComparator,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        comparator,
      );
}

const dataLast: DataLastBuilder<typeof sortImplementation> =
  (comparator) => (data) =>
    sortImplementation(data, comparator);

function sortImplementation<T extends IterableContainer>(
  data: T,
  comparator: (a: T[number], b: T[number]) => number,
): ReorderedArray<T> {
  const ret = data.concat();
  ret.sort(comparator);
  return ret as ReorderedArray<T>;
}
