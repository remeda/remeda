import type { LastArrayElement } from "type-fest";
import { purry1 } from "./internal/purryByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";

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

export function last(data?: unknown): unknown {
  return purry1(lastImplementation, arguments.length, data);
}

const lastImplementation = <T>(data: readonly T[]): T | undefined =>
  data.at(-1);
