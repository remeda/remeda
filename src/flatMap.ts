import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param data - The items to map and flatten.
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(data, callbackfn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (
    input: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => ReadonlyArray<U> | U,
): Array<U>;

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(callbackfn)(data)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  callbackfn: (
    input: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => ReadonlyArray<U> | U,
): (data: ReadonlyArray<T>) => Array<U>;

export function flatMap(...args: ReadonlyArray<unknown>): unknown {
  return purry(flatMapImplementation, args, lazyImplementation);
}

const flatMapImplementation = <T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => ReadonlyArray<U> | U,
): Array<U> => data.flatMap(callbackfn);

const lazyImplementation =
  <T, K>(
    callbackfn: (
      input: T,
      index: number,
      data: ReadonlyArray<T>,
    ) => K | ReadonlyArray<K>,
  ): LazyEvaluator<T, K> =>
  // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
  (value, index, data) => {
    const next = callbackfn(value, index, data);
    return Array.isArray(next)
      ? { done: false, hasNext: true, hasMany: true, next }
      : { done: false, hasNext: true, next };
  };
