/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   meanBy(fn)(array)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */

export function meanBy<T>(
  fn: (value: T, index: number, data: readonly T[]) => number,
): (data: readonly T[]) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param data - The array.
 * @param fn - Predicate function.
 * @signature
 *   meanBy(array, fn)
 * @example
 *    meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */

export function meanBy<T>(
  data: readonly T[],
  fn: (value: T, index: number, data: readonly T[]) => number,
): number;

export function meanBy(dataOrFn: unknown, fn?: unknown): unknown {
  return typeof dataOrFn === "function"
    ? dataLast(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrFn,
      )
    : meanByImplementation(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrFn,
        fn,
      );
}

const dataLast =
  (fn: Parameters<typeof meanByImplementation>[1]) =>
  (data: Parameters<typeof meanByImplementation>[0]) =>
    meanByImplementation(data, fn);

const meanByImplementation = <T>(
  data: readonly T[],
  fn: (value: T, index: number, data: readonly T[]) => number,
): number => {
  if (data.length === 0) {
    return NaN;
  }

  let sum = 0;

  let index = 0;
  for (const item of data) {
    sum += fn(item, index, data);
    index += 1;
  }

  return sum / data.length;
};
