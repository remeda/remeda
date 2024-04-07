import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 *
 * ! **DEPRECATED** Use `R.flat(data)`. Will be removed in V2!
 *
 * @param items - The target array.
 * @signature
 *   R.flatten(array)
 * @example
 *    R.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.flat(data)`. Will be removed in V2!
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

/**
 * Flattens `array` a single level deep.
 *
 * ! **DEPRECATED** Use `R.flat(data)`. Will be removed in V2!
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
 * @deprecated Use `R.flat()`. Will be removed in V2!
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten(): unknown {
  return purry(_flatten, arguments, flatten.lazy);
}

function _flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>> {
  return _reduceLazy(items, flatten.lazy());
}

export namespace flatten {
  export const lazy =
    <T>(): LazyEvaluator<T, Flatten<T>> =>
    // eslint-disable-next-line unicorn/consistent-function-scoping -- I tried pulling the function out but I couldn't get the `<T>` to get inferred correctly.
    (item) =>
      // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
      Array.isArray(item)
        ? { done: false, hasNext: true, hasMany: true, next: item }
        : { done: false, hasNext: true, next: item };
}
