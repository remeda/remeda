/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment -- FIXME! */

import { _reduceLazy, LazyResult } from './_reduceLazy';
import { purry } from './purry';

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
  items: ReadonlyArray<T>
) => Array<FlattenDeep<T>>;

export function flattenDeep() {
  return purry(_flattenDeep, arguments, flattenDeep.lazy);
}

function _flattenDeep<T>(items: Array<T>): Array<FlattenDeep<T>> {
  return _reduceLazy(items, flattenDeep.lazy());
}

function _flattenDeepValue<T>(value: T | Array<T>): T | Array<FlattenDeep<T>> {
  if (!Array.isArray(value)) {
    return value;
  }
  const ret: Array<any> = [];
  value.forEach(item => {
    if (Array.isArray(item)) {
      ret.push(...flattenDeep(item));
    } else {
      ret.push(item);
    }
  });
  return ret;
}

export namespace flattenDeep {
  export function lazy() {
    return (value: any): LazyResult<any> => {
      const next = _flattenDeepValue(value);
      if (Array.isArray(next)) {
        return {
          done: false,
          hasNext: true,
          hasMany: true,
          next: next,
        };
      }
      return {
        done: false,
        hasNext: true,
        next,
      };
    };
  }
}
