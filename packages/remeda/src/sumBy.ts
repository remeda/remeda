import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import doReduce from "./internal/doReduce";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Reducer } from "./internal/types/LazyFunc";
import { mapCallback } from "./internal/utilityEvaluators";

type SumBy<
  T extends IterableContainer,
  U extends bigint | number,
> = T extends readonly []
  ? 0
  : T extends readonly [unknown, ...ReadonlyArray<unknown>]
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
 * @dataLast
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  callbackfn: ArrayMethodCallback<T, number>,
): Reducer<T, SumBy<T, number>>;
export function sumBy<T extends IterableContainer>(
  callbackfn: ArrayMethodCallback<T, bigint>,
): Reducer<T, SumBy<T, bigint>>;

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
 *   R.sumBy(array, fn)
 * @example
 *    R.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 *    R.sumBy(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      x => x.a
 *    ) // 9n
 * @dataFirst
 * @category Array
 */

export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: ArrayMethodCallback<T, number>,
): SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: ArrayMethodCallback<T, bigint>,
): SumBy<T, bigint>;

export function sumBy(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(sumByImplementation, args);
}

const sumByImplementation = <T>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, bigint | number>,
): bigint | number => {
  let sum: number | bigint | undefined;
  for (const [, summand] of mapCallback(data, callbackfn)) {
    if (sum === undefined) {
      sum = summand;
    } else {
      // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      sum += summand;
    }
  }
  return sum ?? 0;
};
