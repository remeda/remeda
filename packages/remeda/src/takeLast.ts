import { purry2 } from "./internal/purryByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Takes the last `n` elements from `data`.
 *
 * Related operations:
 * - `dropLast` - to skip past the last `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `take` - same, but from the start of the array.
 *
 * @param data - The target array.
 * @param n - The number of elements to take.
 * @signature
 *    takeLast(data, n)
 * @example
 *    takeLast([1, 2, 3, 4, 5], 2) // => [4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLast<T extends IterableContainer>(
  data: T,
  n: number,
): T[number][];

/**
 * Take the last `n` elements from `data`.
 *
 * Related operations:
 * - `dropLast` - to skip past the last `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `take` - same, but from the start of the array.
 *
 * @param n - The number of elements to take.
 * @signature
 *    takeLast(n)(data)
 * @example
 *    takeLast(2)([1, 2, 3, 4, 5]) // => [4, 5]
 * @dataLast
 * @category Array
 */
export function takeLast<T extends IterableContainer>(
  n: number,
): (data: T) => T[number][];

export function takeLast(dataOrN: unknown, n?: unknown): unknown {
  return purry2(takeLastImplementation, arguments.length, dataOrN, n);
}

const takeLastImplementation = <T extends IterableContainer>(
  data: T,
  n: number,
): T[number][] => (n > 0 ? data.slice(Math.max(0, data.length - n)) : []);
