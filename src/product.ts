import { purry } from "./purry";

// TODO: Support bigint once we bump our typescript version beyond ES5

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
 * @mapping ramda product
 */
export function product(data: ReadonlyArray<number>): number;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * @signature
 *   R.product()(data);
 * @example
 *   R.pipe([1, 2, 3], R.product()); // => 6
 *   R.pipe([], R.product()); // => 0
 * @dataLast
 * @category Number
 * @mapping ramda product
 */
export function product(): (data: ReadonlyArray<number>) => number;

export function product(): unknown {
  return purry(productImplementation, arguments);
}

function productImplementation(data: ReadonlyArray<number>): number {
  let out = 1;
  for (const value of data) {
    out *= value;
  }
  return out;
}
