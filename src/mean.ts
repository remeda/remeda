import type {
  IterableContainer,
  NonEmptyArray,
  NonEmptyReadonlyArray,
} from "./internal/types";
import { purry } from "./purry";
import { sum } from "./sum";

type Mean<T extends IterableContainer<bigint> | IterableContainer<number>> =
  T extends NonEmptyArray<bigint> | NonEmptyReadonlyArray<bigint>
    ? bigint
    : T extends NonEmptyArray<number> | NonEmptyReadonlyArray<number>
      ? number
      : T extends [] | readonly []
        ? undefined
        : number | undefined;

/**
 * Returns the mean of the elements of an array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.mean(data);
 * @example
 *   R.mean([1, 2, 3]); // => 2
 *   R.mean([1n, 2n, 3n]); // => 2n
 *   R.mean([]); // => undefined
 * @dataFirst
 * @category Number
 */
export function mean<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Mean<T>;

/**
 * Returns the mean of the elements of an array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @signature
 *   R.mean()(data);
 * @example
 *   R.pipe([1, 2, 3], R.mean()); // => 2
 *   R.pipe([1n, 2n, 3n], R.mean()); // => 2n
 *   R.pipe([], R.mean()); // => undefined
 * @dataLast
 * @category Number
 */
export function mean(): <
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Mean<T>;

export function mean(...args: ReadonlyArray<unknown>): unknown {
  return purry(meanImplementation, args);
}

function meanImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] | undefined {
  if (data.length === 0) {
    return undefined;
  }

  const dataSum = sum(data);

  return typeof dataSum === "bigint"
    ? dataSum / BigInt(data.length)
    : dataSum / data.length;
}
