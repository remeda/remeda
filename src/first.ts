import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type First<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...Array<unknown>]
    ? T[0]
    : T extends readonly [...infer Pre, infer Last]
      ? Last | Pre[0]
      : T[0] | undefined;

/**
 * Gets the first element of `array`.
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 * @category Array
 * @pipeable
 * @dataFirst
 */
export function first<T extends IterableContainer>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    R.first()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.first(),
 *      x => x + 1
 *    ); // => 5
 * @category Array
 * @pipeable
 * @dataLast
 */
export function first(): <T extends IterableContainer>(data: T) => First<T>;

export function first() {
  return purry(_first, arguments, first.lazy);
}

function _first<T>([first]: ReadonlyArray<T>) {
  return first;
}

export namespace first {
  export function lazy<T>() {
    return (value: T) => ({
      done: true,
      hasNext: true,
      next: value,
    });
  }

  export namespace lazy {
    export const single = true;
  }
}
