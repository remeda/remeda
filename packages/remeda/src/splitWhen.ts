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
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
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
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): (data: readonly T[]) => [T[], T[]];

export function splitWhen(
  dataOrPredicate: unknown,
  predicate?: unknown,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLast(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrPredicate,
      )
    : splitWhenImplementation(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrPredicate,
        predicate,
      );
}

const dataLast =
  (predicate: Parameters<typeof splitWhenImplementation>[1]) =>
  (data: Parameters<typeof splitWhenImplementation>[0]) =>
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
