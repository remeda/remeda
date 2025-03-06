import type { IterableElement } from "type-fest";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import { purry } from "./purry";

/**
 * Removes last `n` elements from the `data`.
 *
 * @param data - The target iterable.
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(array, n)
 * @example
 *    R.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function dropLast<T extends Iterable<unknown>>(
  data: T,
  n: number,
): Array<IterableElement<T>>;

/**
 * Removes last `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(n)(array)
 * @example
 *    R.dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function dropLast(
  n: number,
): <T extends Iterable<unknown>>(array: T) => Array<IterableElement<T>>;

export function dropLast(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropLastImplementation, args);
}

function dropLastImplementation<T>(input: Iterable<T>, n: number): Array<T> {
  if (n > 0) {
    const array = toReadonlyArray(input);
    return array.slice(0, Math.max(0, array.length - n));
  }
  return [...input];
}
