import { t as StrictFunction } from "./StrictFunction-BtcQmnG5.cjs";

//#region src/internal/types/LazyResult.d.ts
type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;
type LazyEmpty = {
  done: boolean;
  hasNext: false;
  hasMany?: false | undefined;
  next?: undefined;
};
type LazyNext<T> = {
  done: boolean;
  hasNext: true;
  hasMany?: false | undefined;
  next: T;
};
type LazyMany<T> = {
  done: boolean;
  hasNext: true;
  hasMany: true;
  next: ReadonlyArray<T>;
};
//#endregion
//#region src/internal/types/LazyEvaluator.d.ts
type LazyEvaluator<T = unknown, R = T> = (item: T, index: number, data: ReadonlyArray<T>) => LazyResult<R>;
//#endregion
//#region src/purry.d.ts
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
 * @param lazy - A lazy version of the function to purry.
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
declare function purry(fn: StrictFunction, args: ReadonlyArray<unknown>, lazy?: (...args: any) => LazyEvaluator): unknown;
//#endregion
export { purry as t };
//# sourceMappingURL=purry-CyUiH4KW.d.cts.map