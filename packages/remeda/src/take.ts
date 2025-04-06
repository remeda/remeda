import doTransduce from "./internal/doTransduce";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(takeImplementation, lazyImplementation, args);
}

function takeImplementation<T>(input: ReadonlyArray<T>, n: number): Array<T> {
  return n < 0 ? [] : input.slice(0, n);
}

function* lazyImplementation<T>(input: Iterable<T>, n: number): Iterable<T> {
  if (n > 0) {
    for (const item of input) {
      yield item;
      n--;
      if (n <= 0) {
        break;
      }
    }
  }
}
