import type { DataLastBuilder } from "./internal/types/DataLastBuilder";

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   meanBy(fn)(data)
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
 *   meanBy(data, fn)
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
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrFn,
      )
    : meanByImplementation(
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrFn,
        fn,
      );
}

const dataLast: DataLastBuilder<typeof meanByImplementation> = (fn) => (data) =>
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
