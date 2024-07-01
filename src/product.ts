import { type IterableContainer } from "./internal/types";
import { purry } from "./purry";

type Product<T extends IterableContainer<bigint> | IterableContainer<number>> =
  // Empty arrays would always result in a product of (a non-bigint) 1
  T extends readonly []
    ? 1
    : // Non-empty bigint arrays will always result in a bigint product.
      T extends readonly [bigint, ...ReadonlyArray<unknown>]
      ? bigint
      : // But an empty bigint array would result in a non-bigint 1.
        T[number] extends bigint
        ? bigint | 1
        : // Non-bigint arrays are always handled correctly.
          number;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.product(data);
 * @example
 *   R.product([1, 2, 3]); // => 6
 *   R.product([1n, 2n, 3n]); // => 6n
 *   R.product([]); // => 1
 * @dataFirst
 * @category Number
 */
export function product<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Product<T>;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @signature
 *   R.product()(data);
 * @example
 *   R.pipe([1, 2, 3], R.product()); // => 6
 *   R.pipe([1n, 2n, 3n], R.product()); // => 6n
 *   R.pipe([], R.product()); // => 1
 * @dataLast
 * @category Number
 */
export function product(): <
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Product<T>;

export function product(...args: ReadonlyArray<unknown>): unknown {
  return purry(productImplementation, args);
}

function productImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] {
  let out = typeof data[0] === "bigint" ? 1n : 1;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    out *= value;
  }
  return out;
}
