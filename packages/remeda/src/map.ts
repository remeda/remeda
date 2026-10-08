import { purryWithLazy } from "./internal/purryWithLazy";
import { canReadData, requireData } from "./internal/requireData";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { Mapped } from "./internal/types/Mapped";

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
 *    map(data, callbackfn)
 * @example
 *    map([1, 2, 3], multiply(2)); // => [2, 4, 6]
 *    map([0, 0], add(1)); // => [1, 1]
 *    map([0, 0], (value, index) => value + index); // => [0, 1]
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
 *    map(callbackfn)(data)
 * @example
 *    pipe([1, 2, 3], map(multiply(2))); // => [2, 4, 6]
 *    pipe([0, 0], map(add(1))); // => [1, 1]
 *    pipe([0, 0], map((value, index) => value + index)); // => [0, 1]
 * @dataLast
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  callbackfn: LazyCallback<T, U>,
): (data: T) => Mapped<T, U>;

export function map(...args: readonly unknown[]): unknown {
  return purryWithLazy(mapImplementation, args, lazyImplementation);
}

const mapImplementation = <T, U>(
  data: readonly T[],
  callbackfn: (value: T, index: number, data: readonly T[]) => U,
): U[] => data.map(callbackfn);

const lazyImplementation = <T, U>(
  callbackfn: (value: T, index: number, data: readonly T[]) => U,
): LazyEvaluator<T, U> =>
  canReadData(callbackfn)
    ? requireData((value, index, data) => callbackfn(value, index, data))
    : // A callback that doesn't read `data` already is a complete evaluator,
      // and using it directly saves a call per item. It is never marked:
      // `requireData` only marks the wrapper above. It also receives the
      // pipe's slot as a 4th argument, which it doesn't declare, so only
      // `arguments` could see it.
      callbackfn;
