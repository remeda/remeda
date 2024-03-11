import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param array The array.
 * @param callbackfn The callback function.
 * @returns The original array
 * @signature
 *    R.forEach(array, callbackfn)
 *    R.forEach(array, callbackfn)
 * @example
 *    R.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    }) // => [1, 2, 3]
 *    R.forEach([1, 2, 3], (x, i) => {
 *      console.log(x, i)
 *    }) // => [1, 2, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  array: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => void,
): Array<T>;

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param callbackfn the function mapper
 * @signature
 *    R.forEach(callbackfn)(array)
 *    R.forEach(callbackfn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach((x, i) => {
 *        console.log(x, i)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => void,
): (array: ReadonlyArray<T>) => Array<T>;

export function forEach(): unknown {
  return purry(forEachImplementation, arguments, _lazy);
}

function forEachImplementation<T>(
  array: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => void,
): Array<T> {
  // eslint-disable-next-line unicorn/no-array-for-each, unicorn/no-array-callback-reference
  array.forEach(callbackfn);
  // @ts-expect-error [ts4104] - To make it useful in a pipe we return the input array, but because our functions always take a readonly input and return a mutable output we have a problem here. Either we clone the array, which is wasteful or we loosen the typing here and hope that nobody is assuming we cloned the array. We can also change the typing for the function itself so that the non-lazy dataFirst impl doesn't return the array (as the regular `Array.prototype.forEach` does), and only return the array for the lazy impl, where it's implicitly readonly anyway.
  return array;
}

const _lazy =
  <T>(
    callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => void,
  ): LazyEvaluator<T> =>
  (value, index, array) => {
    callbackfn(value, index, array);
    return { done: false, hasNext: true, next: value };
  };
