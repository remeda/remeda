import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";

/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(array, fn)
 * @example
 *    splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T>(
  data: readonly T[],
  predicate: ArrayCallback<readonly T[], boolean>,
): [T[], T[]];

/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(fn)(array)
 * @example
 *    splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  predicate: ArrayCallback<readonly T[], boolean>,
): (data: readonly T[]) => [T[], T[]];

export function splitWhen(
  dataOrPredicate:
    readonly unknown[] | ArrayCallback<readonly unknown[], boolean>,
  predicate?: ArrayCallback<readonly unknown[], boolean>,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLast(dataOrPredicate)
    : splitWhenImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof splitWhenImplementation> =
  (predicate) => (data) =>
    splitWhenImplementation(data, predicate);

function splitWhenImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): [T[], T[]] {
  const index = data.findIndex(predicate);
  return index === -1
    ? [data.concat(), []]
    : [data.slice(0, index), data.slice(index)];
}
