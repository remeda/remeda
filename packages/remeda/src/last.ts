import type { LastArrayElement } from "type-fest";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    last(array)
 * @example
 *    last([1, 2, 3]) // => 3
 *    last([]) // => undefined
 * @dataFirst
 * @category Array
 */
export function last<T extends IterableContainer>(data: T): LastArrayElement<T>;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    last()(array)
 * @example
 *    pipe(
 *      [1, 2, 4, 8, 16],
 *      filter(x => x > 3),
 *      last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @category Array
 */
export function last(): <T extends IterableContainer>(
  data: T,
) => LastArrayElement<T>;

export function last(...args: readonly unknown[]): unknown {
  return purry(lastImplementation, args);
}

const lastImplementation = <T>(array: readonly T[]): T | undefined =>
  array.at(-1);
