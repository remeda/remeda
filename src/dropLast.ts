import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Removes last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(array, n)
 * @example
 *    R.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function dropLast<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

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
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function dropLast(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropLastImplementation, args);
}

const dropLastImplementation = <T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]> =>
  n > 0 ? array.slice(0, Math.max(0, array.length - n)) : [...array];
