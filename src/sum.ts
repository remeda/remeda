import { purry } from "./purry";

// TODO: Support bigint once we bump our typescript version beyond ES5

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.sum(data);
 * @example
 *   R.sum([1, 2, 3]); // => 6
 *   R.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
export function sum(data: ReadonlyArray<number>): number;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * @signature
 *   R.sum()(data);
 * @example
 *   R.pipe([1, 2, 3], R.sum()); // => 6
 *   R.pipe([], R.sum()); // => 0
 * @dataLast
 * @category Number
 */
export function sum(): (data: ReadonlyArray<number>) => number;

export function sum(): unknown {
  return purry(sumImplementation, arguments);
}

const sumImplementation = (data: ReadonlyArray<number>): number =>
  data.reduce((acc, value) => acc + value, 0);
