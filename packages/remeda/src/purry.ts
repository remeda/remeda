/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a function with `dataFirst` and `dataLast` signatures.
 *
 * `purry` is a dynamic function and it's not type safe. It should be wrapped by
 * a function that have proper typings. Refer to the example below for correct
 * usage.
 *
 * !IMPORTANT: functions that simply call `purry` and return the result (like
 * almost all functions in this library) should return `unknown` themselves if
 * an explicit return type is required. This is because we currently don't
 * provide a generic return type that is built from the input function, and
 * crafting one manually isn't worthwhile as we rely on function declaration
 * overloading to combine the types for dataFirst and dataLast invocations!
 *
 * @param fn - The function to purry.
 * @param args - The arguments.
 * @signature R.purry(fn, args);
 * @example
 *    function _findIndex(array, fn) {
 *      for (let i = 0; i < array.length; i++) {
 *        if (fn(array[i])) {
 *          return i;
 *        }
 *      }
 *      return -1;
 *    }
 *
 *    // data-first
 *    function findIndex<T>(array: T[], fn: (item: T) => boolean): number;
 *
 *    // data-last
 *    function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;
 *
 *    function findIndex(...args: unknown[]) {
 *      return R.purry(_findIndex, args);
 *    }
 * @category Function
 */
export function purry<Data, Rest extends ReadonlyArray<unknown>, Result>(
  fn: (data: Data, ...rest: Rest) => Result,
  args: readonly [Data, ...Rest],
): Result;
export function purry<Data, Rest extends ReadonlyArray<unknown>, Result>(
  fn: (data: Data, ...rest: Rest) => Result,
  args: Rest,
): (data: Data) => Result;
export function purry<Data, Rest extends ReadonlyArray<unknown>, Result>(
  fn: (data: Data, ...rest: Rest) => Result,
  args: readonly [Data, ...Rest] | Rest,
): Result | ((data: Data) => Result);
export function purry(
  fn: (...args: any) => unknown,
  args: ReadonlyArray<unknown>,
): unknown;

export function purry(
  fn: (...args: any) => unknown,
  args: ReadonlyArray<unknown>,
): unknown {
  const diff = fn.length - args.length;
  if (diff === 0) {
    return fn(...args);
  }

  if (diff === 1) {
    return (data: unknown) => fn(data, ...args);
  }

  throw new Error("Wrong number of arguments");
}
