import type {
  IterableContainer,
  NonEmptyArray,
  NonEmptyReadonlyArray,
} from "./internal/types";
import { isBigInt } from "./isBigInt";
import { isNumber } from "./isNumber";
import { mean } from "./mean";
import { purry } from "./purry";
import { sort } from "./sort";

type Median<T extends IterableContainer<bigint> | IterableContainer<number>> =
  T extends NonEmptyArray<bigint> | NonEmptyReadonlyArray<bigint>
    ? bigint
    : T extends NonEmptyArray<number> | NonEmptyReadonlyArray<number>
      ? number
      : T extends [] | readonly []
        ? undefined
        : number | undefined;

/**
 * Returns the median of the elements of an array.
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

function medianImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] | undefined {
  if (data.length === 0) {
    return undefined;
  }

  // Sort taking into account bigint values
  const sortedData = sort(data, (a, b) => (a > b ? 1 : a < b ? -1 : 0));

  const middleIndex = Math.floor(sortedData.length / 2);

  // For odd length, return the middle element
  if (sortedData.length % 2 !== 0) {
    return sortedData[middleIndex];
  }

  // For even length, return the mean of the two middle elements
  const middleElements = [sortedData[middleIndex - 1], sortedData[middleIndex]];

  if (middleElements.every(isBigInt) || middleElements.every(isNumber)) {
    return mean(middleElements);
  }

  throw new Error("median: invalid types or unexpected input encountered");
}
