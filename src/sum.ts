import { purry } from "./purry";

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
export function sum<T extends ReadonlyArray<bigint> | ReadonlyArray<number>>(
  data: T,
): T[number];

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
export function sum(): <
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(
  data: T,
) => T[number];

export function sum(...args: ReadonlyArray<unknown>): unknown {
  return purry(sumImplementation, args);
}

function sumImplementation<
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(data: T): T[number] {
  let out = typeof data[0] === "bigint" ? 0n : 0;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    out += value;
  }
  return out;
}
