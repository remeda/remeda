import type { IterableContainer } from "./internal/types/IterableContainer";

type SumBy<
  T extends IterableContainer,
  U extends bigint | number,
> = T extends readonly []
  ? 0
  : T extends readonly [unknown, ...(readonly unknown[])]
    ? U
    : U | 0;

/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param callbackfn - Predicate function.
 * @signature
 *   sumBy(fn)(array)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      sumBy(x => x.a)
 *    ) // 9
 *
 *    pipe(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      sumBy(x => x.a)
 *    ) // 9n
 * @dataLast
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  callbackfn: (value: T[number], index: number, data: T) => number,
): (data: T) => SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  callbackfn: (value: T[number], index: number, data: T) => bigint,
): (data: T) => SumBy<T, bigint>;

/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that can return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array.
 * @param callbackfn - Predicate function.
 * @signature
 *   sumBy(array, fn)
 * @example
 *    sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 *    sumBy(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      x => x.a
 *    ) // 9n
 * @dataFirst
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => number,
): SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => bigint,
): SumBy<T, bigint>;

export function sumBy(
  dataOrCallbackfn: unknown,
  callbackfn?: unknown,
): unknown {
  return typeof dataOrCallbackfn === "function"
    ? dataLast(
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrCallbackfn,
      )
    : sumByImplementation(
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrCallbackfn,
        callbackfn,
      );
}

const dataLast =
  (callbackfn: Parameters<typeof sumByImplementation>[1]) =>
  (data: Parameters<typeof sumByImplementation>[0]) =>
    sumByImplementation(data, callbackfn);

const sumByImplementation = <T>(
  data: readonly T[],
  callbackfn: (value: T, index: number, data: readonly T[]) => bigint | number,
): bigint | number => {
  let sum: bigint | number = 0;

  let index = 0;
  for (const item of data) {
    const summand = callbackfn(item, index, data);

    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-assignment -- Every summand has the same type, so the sum keeps it.
    sum = index === 0 ? summand : sum + summand;
    index += 1;
  }

  return sum;
};
