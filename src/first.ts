import type { IterableContainer } from "./_types";
import type { LazyEvaluator } from "./pipe";
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
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function first<T extends IterableContainer>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 *
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
 * @dataLast
 * @pipeable
 * @category Array
 */
export function first(): <T extends IterableContainer>(data: T) => First<T>;

export function first(): unknown {
  return purry(_first, arguments, first.lazy);
}

function _first<T>([item]: ReadonlyArray<T>): T | undefined {
  return item;
}

export namespace first {
  export function lazy<T>(): LazyEvaluator<T> {
    return (value) => ({ done: true, hasNext: true, next: value });
  }

  export namespace lazy {
    export const single = true;
  }
}
