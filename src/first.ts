import type { IterableContainer } from './_types';
import { purry } from './purry';

type FirstOut<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...Array<unknown>]
  ? T[0]
  : T extends readonly [...infer Pre, infer Last]
  ? Pre[0] | Last
  : T[0] | undefined;

/**
 * Gets the first element of `array`.
 * Note: In `pipe`, use `first()` form instead of `first`. Otherwise, the inferred type is lost.
 * @param array the array
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.first(),
 *      x => x + 1
 *    ); // => 5
 *
 * @category array
 * @pipeable
 */
export function first<T extends IterableContainer>(
  array: Readonly<T>
): FirstOut<T>;
export function first<T extends IterableContainer>(): (
  array: Readonly<T>
) => FirstOut<T>;

export function first() {
  return purry(_first, arguments, first.lazy);
}

function _first<T>([first]: ReadonlyArray<T>) {
  return first;
}

export namespace first {
  export function lazy<T>() {
    return (value: T) => {
      return {
        done: true,
        hasNext: true,
        next: value,
      };
    };
  }
  export namespace lazy {
    export const single = true;
  }
}
