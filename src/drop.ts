import { SKIP_ITEM, lazyIdentityEvaluator } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function drop<const T extends Array<unknown>, N extends number>(
  array: T,
  n: N,
): Drop<T, N>;

/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function drop<const T extends Array<unknown>, N extends number>(
  n: N,
): (array: T) => Drop<T, N>;

export function drop(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropImplementation, args, lazyImplementation);
}

const dropImplementation = <const T extends Array<unknown>, N extends number>(
  array: T,
  n: N,
): Drop<T, N> => (n < 0 ? [...array] : array.slice(n)) as never;

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyIdentityEvaluator;
  }

  let left = n;
  return (value) => {
    if (left > 0) {
      left -= 1;
      return SKIP_ITEM;
    }
    return { done: false, hasNext: true, next: value };
  };
}

type Drop<
  Arr extends Array<unknown>,
  Count extends number,
  Removed extends Array<unknown> = [],
> = `${Count}` extends `-${number}`
  ? Arr
  : Arr extends []
    ? Arr
    : Count extends Removed["length"]
      ? Arr
      : Arr extends [unknown, ...infer Rest]
        ? Drop<Rest, Count, [...Removed, null]>
        : Array<Arr[number]>;
