import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type OneLess<Than extends number> = [
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...Array<number>,
][Than];

// will work for readonly arrays of length up to 20, then falls back to union
type Last<T extends IterableContainer> = T extends readonly []
  ? undefined
  : T extends { length: infer L }
    ? L extends number
      ? // for non-empty, we know we can get T[length-1] directly
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends readonly [infer _Head, ...infer _Tail]
        ? T[OneLess<L>]
        : // otherwise we add | undefined
          T[OneLess<L>] | undefined
      : undefined
    : undefined;

/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function last<T extends IterableContainer>(data: T): Last<T>;
// export function last<T>(array: ReadonlyArray<T>): T | undefined;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @pipeable
 * @category Array
 */
export function last<T extends IterableContainer>(): (data: T) => Last<T>;

export function last(): unknown {
  return purry(_last, arguments);
}

function _last<T extends IterableContainer>(data: T): Last<T> | undefined {
  return data[data.length - 1] as Last<T> | undefined;
}
