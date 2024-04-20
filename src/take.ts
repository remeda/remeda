import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type TakeAcc<
  T extends ReadonlyArray<unknown>,
  N extends number,
  Acc extends ReadonlyArray<unknown> = T,
> = `${N}` extends `-${number}`
  ? []
  : Acc["length"] extends N
    ? Acc
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Acc extends readonly [...infer Head, infer _Tail]
      ? TakeAcc<T, N, Head>
      : Mutable<T>;

type Take<T extends ReadonlyArray<unknown>, N extends number> = TakeAcc<T, N>;

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
 * @pipeable
 * @category Array
 */
export function take<T extends ReadonlyArray<unknown>, N extends number>(
  array: T,
  n: N,
): Take<T, N>;

/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function take<T extends ReadonlyArray<unknown>, N extends number>(
  n: N,
): (array: T) => Take<T, N>;

export function take(): unknown {
  return purry(_take, arguments, take.lazy);
}

function _take<T extends ReadonlyArray<unknown>, N extends number>(
  array: T,
  n: N,
): unknown {
  return _reduceLazy(array, take.lazy(n));
}

export namespace take {
  export function lazy<T>(n: number): LazyEvaluator<T> {
    if (n <= 0) {
      return () => ({ done: true, hasNext: false });
    }

    let remaining = n;
    return (value) => {
      remaining -= 1;
      return { done: remaining <= 0, hasNext: true, next: value };
    };
  }
}
