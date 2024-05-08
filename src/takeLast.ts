import { purry } from "./purry";

/**
 * Takes the last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to take.
 * @signature
 *    R.takeLast(array, n)
 * @example
 *    R.takeLast([1, 2, 3, 4, 5], 2) // => [4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLast<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes last `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.takeLast(n)(array)
 * @example
 *    R.takeLast(2)([1, 2, 3, 4, 5]) // => [4, 5]
 * @dataLast
 * @category Array
 */
export function takeLast<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function takeLast(...args: ReadonlyArray<unknown>): unknown {
  return purry(takeLastImplementation, args);
}

const takeLastImplementation = <T>(
  array: ReadonlyArray<T>,
  n: number,
): Array<T> => (n >= 0 ? array.slice(array.length - n) : []);
