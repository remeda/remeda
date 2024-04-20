import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";
import type { Mutable } from "./type-fest/internal";

type DropAcc<
  T extends ReadonlyArray<unknown>,
  N extends number,
  Acc extends ReadonlyArray<unknown> = T,
  Dropped extends ReadonlyArray<unknown> = [],
> = `${N}` extends `-${number}`
  ? Mutable<T>
  : Dropped["length"] extends N
    ? Acc
    : Acc extends readonly [...infer Head, infer Tail]
      ? DropAcc<T, N, Head, [...Dropped, Tail]>
      : [];

type Drop<T extends ReadonlyArray<unknown>, N extends number> =
  T extends Array<unknown> ? T : DropAcc<T, N>;

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
 * @pipeable
 * @category Array
 */
export function drop<T extends ReadonlyArray<unknown>, N extends number>(
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
 * @pipeable
 * @category Array
 */
export function drop<T extends ReadonlyArray<unknown>, N extends number>(
  n: N,
): (array: T) => Drop<T, N>;

export function drop(): unknown {
  return purry(_drop, arguments, drop.lazy);
}

function _drop<T extends ReadonlyArray<unknown>, N extends number>(
  array: T,
  n: N,
): unknown {
  return _reduceLazy(array, drop.lazy(n));
}

export namespace drop {
  export function lazy<T>(n: number): LazyEvaluator<T> {
    let left = n;
    return (value) => {
      if (left > 0) {
        left -= 1;
        return { done: false, hasNext: false };
      }
      return { done: false, hasNext: true, next: value };
    };
  }
}
