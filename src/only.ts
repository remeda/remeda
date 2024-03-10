import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type Only<T extends IterableContainer> = T extends
  | readonly [...Array<unknown>, unknown, unknown]
  | readonly []
  | readonly [unknown, ...Array<unknown>, unknown]
  | readonly [unknown, unknown, ...Array<unknown>]
  ? undefined
  : T extends readonly [unknown]
    ? T[number]
    : T[number] | undefined;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @param array - The target array.
 * @signature
 *    R.only(array)
 * @example
 *    R.only([]) // => undefined
 *    R.only([1]) // => 1
 *    R.only([1, 2]) // => undefined
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @param array - The target array.
 * @signature
 *    R.only()(array)
 * @example
 *    R.pipe([], R.only()); // => undefined
 *    R.pipe([1], R.only()); // => 1
 *    R.pipe([1, 2], R.only()); // => undefined
 * @dataLast
 * @pipeable
 * @category Array
 */
export function only<T extends IterableContainer>(): (
  array: Readonly<T>,
) => Only<T>;

export function only(): unknown {
  return purry(_only, arguments);
}

function _only<T>(array: ReadonlyArray<T>): T | undefined {
  return array.length === 1 ? array[0] : undefined;
}
