import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { Mapped } from "./internal/types/Mapped";
import { purry } from "./purry";

/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param data - The array to map.
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(data, callbackfn)
 * @example
 *    R.map([1, 2, 3], R.multiply(2)); // => [2, 4, 6]
 *    R.map([0, 0], R.add(1)); // => [1, 1]
 *    R.map([0, 0], (value, index) => value + index); // => [0, 1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => U,
): Mapped<T, U>;

/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(callbackfn)(data)
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(2))); // => [2, 4, 6]
 *    R.pipe([0, 0], R.map(R.add(1))); // => [1, 1]
 *    R.pipe([0, 0], R.map((value, index) => value + index)); // => [0, 1]
 * @dataLast
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  callbackfn: (value: T[number], index: number, data: T) => U,
): (data: T) => Mapped<T, U>;

export function map(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapImplementation, args, lazyImplementation);
}

const mapImplementation = <T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
): Array<U> => data.map(callbackfn);

const lazyImplementation =
  <T, U>(
    callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
  ): LazyEvaluator<T, U> =>
  (value, index, data) => ({
    done: false,
    hasNext: true,
    next: callbackfn(value, index, data),
  });
