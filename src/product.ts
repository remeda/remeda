import { purry } from "./purry";

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.product(data);
 * @example
 *   R.product([1, 2, 3]); // => 6
 *   R.product([]); // => 1
 * @dataFirst
 * @category Number
 */
export function product<
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(data: T): T[number];

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * @signature
 *   R.product()(data);
 * @example
 *   R.pipe([1, 2, 3], R.product()); // => 6
 *   R.pipe([], R.product()); // => 1
 * @dataLast
 * @category Number
 */
export function product(): <
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(
  data: T,
) => T[number];

export function product(...args: ReadonlyArray<unknown>): unknown {
  return purry(productImplementation, args);
}

function productImplementation<
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(data: T): T[number] {
  let out = typeof data[0] === "bigint" ? 1n : 1;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    out *= value;
  }
  return out;
}
