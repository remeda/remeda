import { purry } from "./purry";
import type { LazyResult } from "./_reduceLazy";
import { _reduceLazy } from "./_reduceLazy";

/**
 * Removes first `n` elements from the `array`.
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function drop<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes first `n` elements from the `array`.
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function drop<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function drop() {
  return purry(_drop, arguments, drop.lazy);
}

function _drop<T>(array: ReadonlyArray<T>, n: number) {
  return _reduceLazy(array, drop.lazy(n));
}

export namespace drop {
  export function lazy<T>(n: number) {
    let left = n;
    return (value: T): LazyResult<T> => {
      if (left > 0) {
        left -= 1;
        return {
          done: false,
          hasNext: false,
        };
      }
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
  }
}
