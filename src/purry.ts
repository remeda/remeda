/* eslint-disable @typescript-eslint/no-explicit-any */

type LazyFactory = (...args: any) => unknown;

type MaybeLazyFunction = {
  (...args: any): unknown;
  lazy?: LazyFactory;
};

/**
 * Creates a function with `data-first` and `data-last` signatures.
 *
 * `purry` is a dynamic function and it's not type safe. It should be wrapped by a function that have proper typings.
 * Refer to the example below for correct usage.
 *
 * @param fn the function to purry.
 * @param args the arguments
 * @signature R.purry(fn, arguments);
 * @exampleRaw
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
 *    function findIndex() {
 *      return R.purry(_findIndex, arguments);
 *    }
 * @category Function
 */
export function purry(
  fn: MaybeLazyFunction,
  args: IArguments | ReadonlyArray<unknown>,
  lazyFactory?: LazyFactory,
): unknown {
  // TODO: Once we bump our target beyond ES5 we can spread the args array directly and don't need this...
  const callArgs = Array.from(args) as ReadonlyArray<unknown>;

  const diff = fn.length - args.length;
  if (diff === 0) {
    return fn(...callArgs);
  }

  if (diff === 1) {
    const ret = (data: unknown) => fn(data, ...callArgs);
    const lazy = lazyFactory ?? fn.lazy;
    return lazy === undefined
      ? ret
      : Object.assign(ret, { lazy, lazyArgs: args });
  }

  throw new Error("Wrong number of arguments");
}
