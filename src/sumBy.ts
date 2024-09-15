import { purry } from "./purry";
import { type IterableContainer } from "./internal/types";

type SumBy<T, TS extends IterableContainer<T>> = TS extends []
  ? 0
  : TS extends readonly [T, ...ReadonlyArray<T>]
    ? bigint
    : bigint | 0;

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
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
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

export function sumBy<
  T,
  TS extends IterableContainer<T> = IterableContainer<T>,
>(
  callbackfn: (value: T, index: number, data: TS) => bigint,
): (items: TS) => SumBy<T, TS>;

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

export function sumBy<
  T,
  TS extends IterableContainer<T> = IterableContainer<T>,
>(
  data: TS,
  callbackfn: (value: T, index: number, data: TS) => bigint,
): SumBy<T, TS>;

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
  const [head, ...tail] = array;
  let sum = array.length === 0 ? 0 : callbackfn(head!, 0, array);

  for (const [index, item] of tail.entries()) {
    const summand = callbackfn(item, index + 1, array);

    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    sum += summand;
  }
  return sum;
};
