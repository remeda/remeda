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
 * @dataLast
 * @category Array
 */

export function sumBy<T>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): (items: ReadonlyArray<T>) => number;

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
 * @dataFirst
 * @category Array
 */

export function sumBy<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number;

export function sumBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(sumByImplementation, args);
}

const sumByImplementation = <T>(
  array: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number => {
  let sum = 0;
  for (const [index, item] of array.entries()) {
    const summand = callbackfn(item, index, array);
    sum += summand;
  }
  return sum;
};
