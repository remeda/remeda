import { lazyDataLastImpl } from "./internal/lazyDataLastImpl";
import type { StrictFunction } from "./internal/types/StrictFunction";

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
 * @signature purry(fn, args);
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
 *      return purry(_findIndex, args);
 *    }
 * @category Function
 */
export const purry = (fn: StrictFunction, args: readonly unknown[]): unknown =>
  args.length >= fn.length
    ? fn(
        // @ts-expect-error [ts2345] -- This error is accurate because we don't
        // know anything about `fn` so can't ensure that we are passing the
        // correct arguments to it, we just have to trust that the caller knows
        // what they are doing.
        ...args,
      )
    : lazyDataLastImpl(fn, args);
