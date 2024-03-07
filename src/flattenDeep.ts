/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-readonly-parameter-types -- FIXME! */

import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type FlattenDeep<T> = T extends ReadonlyArray<infer K> ? FlattenDeep2<K> : T;
type FlattenDeep2<T> = T extends ReadonlyArray<infer K> ? FlattenDeep3<K> : T;
type FlattenDeep3<T> = T extends ReadonlyArray<infer K> ? FlattenDeep4<K> : T;
type FlattenDeep4<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Recursively flattens `array`.
 * @param items the target array
 * @signature
 *   R.flattenDeep(array)
 * @example
 *    R.flattenDeep([[1, 2], [[3], [4, 5]]]) // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 */
export function flattenDeep<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>>;

/**
 * Recursively flattens `array`.
 * @param items the target array
 * @signature
 *   R.flattenDeep()(array)
 * @example
 *    R.pipe(
 *      [[1, 2], [[3], [4, 5]]],
 *      R.flattenDeep(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 * @dataLast
 */
export function flattenDeep<T>(): (
  items: ReadonlyArray<T>,
) => Array<FlattenDeep<T>>;

export function flattenDeep(): unknown {
  return purry(_flattenDeep, arguments, flattenDeep.lazy);
}

function _flattenDeep<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>> {
  return _reduceLazy(items, flattenDeep.lazy());
}

function _flattenDeepValue<T>(value: Array<T> | T): Array<FlattenDeep<T>> | T {
  if (!Array.isArray(value)) {
    return value;
  }
  const ret: Array<any> = [];

  for (const item of value) {
    if (Array.isArray(item)) {
      ret.push(...flattenDeep(item));
    } else {
      ret.push(item);
    }
  }

  return ret;
}

export namespace flattenDeep {
  export const lazy =
    <T>(): LazyEvaluator<T, any> =>
    // eslint-disable-next-line unicorn/consistent-function-scoping -- I tried pulling the function out but I couldn't get the `<T>` to get inferred correctly.
    (value) => {
      const next = _flattenDeepValue(value);
      return Array.isArray(next)
        ? { done: false, hasNext: true, hasMany: true, next }
        : { done: false, hasNext: true, next };
    };
}
