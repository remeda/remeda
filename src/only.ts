import { IterableContainer } from './_types';
import { purry } from './purry';

type Only<T extends IterableContainer> = T extends
  | readonly []
  | readonly [unknown, unknown, ...Array<unknown>]
  | readonly [unknown, ...Array<unknown>, unknown]
  | readonly [...Array<unknown>, unknown, unknown]
  ? undefined
  : T extends readonly [unknown]
    ? T[number]
    : T[number] | undefined;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 * @param array the target array
 * @signature
 *    R.only(array)
 * @example
 *    R.only([]) // => undefined
 *    R.only([1]) // => 1
 *    R.only([1, 2]) // => undefined
 * @pipeable
 * @category Array
 * @dataFirst
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 * @param array the target array
 * @signature
 *    R.only()(array)
 * @example
 *    R.pipe([], R.only()); // => undefined
 *    R.pipe([1], R.only()); // => 1
 *    R.pipe([1, 2], R.only()); // => undefined
 * @pipeable
 * @category Array
 * @dataLast
 */
export function only<T extends IterableContainer>(): (
  array: Readonly<T>
) => Only<T>;

export function only() {
  return purry(_only, arguments);
}

function _only<T>(array: ReadonlyArray<T>) {
  if (array.length === 1) {
    return array[0];
  }
  return undefined;
}
