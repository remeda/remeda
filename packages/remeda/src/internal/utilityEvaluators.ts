import { isArray } from "../isArray";
import type { ArrayMethodCallback } from "./types/ArrayMethodCallback";

export function* mapCallback<T, U>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, U>,
): Iterable<[T, U]> {
  let index = 0;
  let writableData: Array<T> | undefined;
  const dataArg: ReadonlyArray<T> = isArray(data) ? data : (writableData = []);
  for (const value of data) {
    if (writableData !== undefined) {
      writableData.push(value);
    }
    yield [value, callbackfn(value, index++, dataArg)];
  }
}

/**
 * Simplifies an array method callback function into a function that takes a
 * single argument and invokes the original callback with that argument, a
 * sequential index, and the a data array.
 *
 * The `data` argument passed to the callback is `data` if it is an array, or a
 * new array containing all the items seen so far if it is not an array.
 *
 * @param callbackfn - The callback function to simplify.
 * @param data - The original data array to pass to the callback.
 * @returns A simplified callback function.
 */
export function simplifyCallback<T, U>(
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, U>,
  data: Iterable<T>,
): (value: T) => U {
  let index = 0;
  let writableData: Array<T> | undefined;
  const dataArg: ReadonlyArray<T> = isArray(data) ? data : (writableData = []);
  return (value) => {
    if (writableData !== undefined) {
      writableData.push(value);
    }
    return callbackfn(value, index++, dataArg);
  };
}
