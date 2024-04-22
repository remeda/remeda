import { type LastArrayElement } from "type-fest";
import { type IterableContainer } from "./internal/types";
import { purry } from "./purry";

type Last<T extends IterableContainer> = LastArrayElement<
  T,
  // Type-fest's LastArrayElement assumes a looser typescript configuration
  // where `noUncheckedIndexedAccess` is disabled. To support the stricter
  // configuration we assume we need to assign the "LastArrayElement" param to
  // `undefined`, but only if the array isn't empty.
  T extends readonly [] ? never : undefined
>;

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
export function last(): <T extends IterableContainer>(data: T) => Last<T>;

export function last(...args: ReadonlyArray<unknown>): unknown {
  return purry(lastImplementation, args);
}

const lastImplementation = <T>(array: ReadonlyArray<T>): T | undefined =>
  array.at(-1);
