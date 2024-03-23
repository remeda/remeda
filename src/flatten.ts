import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 *
 * @param items - The target array.
 * @signature
 *   R.flatten(array)
 * @example
 *    R.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

/**
 * Flattens `array` a single level deep.
 *
 * @signature
 *   R.flatten()(array)
 * @example
 *    R.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      R.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten(...args: ReadonlyArray<unknown>): unknown {
  return purry(flattenImplementation, args, lazyImplementation);
}

const flattenImplementation = <T>(items: ReadonlyArray<T>): Array<Flatten<T>> =>
  _reduceLazy(items, lazyImplementation());

const lazyImplementation =
  <T>(): LazyEvaluator<T, Flatten<T>> =>
  // eslint-disable-next-line unicorn/consistent-function-scoping -- I tried pulling the function out but I couldn't get the `<T>` to get inferred correctly.
  (item) =>
    // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
    Array.isArray(item)
      ? { done: false, hasNext: true, hasMany: true, next: item }
      : { done: false, hasNext: true, next: item };
