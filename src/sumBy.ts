import { purry } from "./purry";

/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * @param callbackfn - Predicate function.
 * @signature
 *   R.sumBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9
 *
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9n
 *
 *    R.pipe([] as {a: bigint}[], R.sumBy(x => x.a)) // 0
 * @dataLast
 * @category Array
 */

export function sumBy<T>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): (items: ReadonlyArray<T>) => number;

export function sumBy<T>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => bigint,
): (items: ReadonlyArray<T>) => bigint | 0;

/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * @param data - The array.
 * @param callbackfn - Predicate function.
 * @signature
 *   R.sumBy(array, fn)
 * @example
 *    R.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 *
 *    R.sumBy(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      x => x.a
 *    ) // 9n
 *
 *   R.sumBy([] as {a: bigint}[], x => x.a)
 * @dataFirst
 * @category Array
 */

export function sumBy<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number;

export function sumBy<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => bigint,
): bigint | 0;

export function sumBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(sumByImplementation, args);
}

const sumByImplementation = <T>(
  array: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => bigint | number,
): bigint | number => {
  let sum: bigint | number | undefined;
  for (const [index, item] of array.entries()) {
    const summand = callbackfn(item, index, array);
    if (sum === undefined) {
      sum = summand;
      continue;
    }
    // we use an `as number` here to let TypeScript
    // treats `sum` and `summand` as the same type
    (sum as number) += summand as number;
  }
  return sum ?? 0;
};
