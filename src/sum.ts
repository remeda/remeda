import { type IterableContainer } from "./internal/types";
import { purry } from "./purry";

type Sum<T extends IterableContainer<bigint> | IterableContainer<number>> =
  // Non-empty bigint arrays will always result in a bigint sum.
  T extends [bigint, ...ReadonlyArray<unknown>]
    ? bigint
    : // But an empty bigint array would result in a non-bigint 0.
      T[number] extends bigint
      ? bigint | 0
      : // Non-bigint arrays are always handled correctly.
        number;

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
export function sum<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Sum<T>;

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
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Sum<T>;

export function sum(...args: ReadonlyArray<unknown>): unknown {
  return purry(sumImplementation, args);
}

function sumImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] {
  let out = typeof data[0] === "bigint" ? 0n : 0;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    out += value;
  }
  return out;
}
