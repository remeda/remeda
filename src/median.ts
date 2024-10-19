import type {
  IterableContainer,
  NonEmptyArray,
  NonEmptyReadonlyArray,
} from "./internal/types";
import { purry } from "./purry";

type Median<T extends IterableContainer<bigint> | IterableContainer<number>> =
  T extends NonEmptyArray<bigint> | NonEmptyReadonlyArray<bigint>
    ? bigint
    : T extends NonEmptyArray<number> | NonEmptyReadonlyArray<number>
      ? number
      : T extends [] | readonly []
        ? undefined
        : T[number] extends bigint
          ? bigint | undefined
          : number | undefined;

/**
 * Returns the median of the elements of an array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * Regarding `bigint` arrays, the result is rounded down (truncated) when the array has an even number of elements. This happens because `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.median(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.pipe([6n, 10n, 11n], R.median()); // => 10n
 *   R.median([]); // => undefined
 * @dataFirst
 * @category Number
 */
export function median<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Median<T>;

/**
 * Returns the median of the elements of an array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * Regarding `bigint` arrays, the result is rounded down (truncated) when the array has an even number of elements. This happens because `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @signature
 *   R.median()(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.pipe([6n, 10n, 11n], R.median()); // => 10n
 *   R.pipe([], R.median()); // => undefined
 * @dataLast
 * @category Number
 */
export function median(): <
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Median<T>;

export function median(...args: ReadonlyArray<unknown>): unknown {
  return purry(medianImplementation, args);
}

const numberAndBigIntComparator = (
  a: number | bigint,
  b: number | bigint,
): number => (a > b ? 1 : a < b ? -1 : 0);

function medianImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] | undefined {
  if (data.length === 0) {
    return undefined;
  }

  // Sort taking into account bigint values
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSorted` here.
  const sortedData = [...data].sort(numberAndBigIntComparator);

  // For odd length, return the middle element
  if (sortedData.length % 2 !== 0) {
    return sortedData[(sortedData.length - 1) / 2];
  }

  const middleIndex = Math.floor(sortedData.length / 2);

  // For even length, return the mean of the two middle elements
  const firstMiddle = sortedData[middleIndex];
  const secondMiddle = sortedData[middleIndex - 1];

  return typeof firstMiddle === "bigint"
    ? // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      (firstMiddle + (secondMiddle as bigint)) / 2n
    : // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      ((firstMiddle as number) + (secondMiddle as number)) / 2;
}
