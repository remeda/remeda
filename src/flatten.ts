import { _reduceLazy, LazyResult } from './_reduceLazy';
import { purry } from './purry';

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 * Note: In `pipe`, use `flatten()` form instead of `flatten`. Otherwise, the inferred type is lost.
 
 * @param items the target array
 * @signature R.flatten(array)
 * @example
 *    R.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 *    R.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      R.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 */
export function flatten<T>(items: readonly T[]): Array<Flatten<T>>;

export function flatten<T>(): (items: readonly T[]) => Array<Flatten<T>>;

export function flatten() {
  return purry(_flatten, arguments, flatten.lazy);
}

function _flatten<T>(items: T[]): Array<Flatten<T>> {
  return _reduceLazy(items, flatten.lazy());
}

export namespace flatten {
  export function lazy<T>() {
    return (next: T): LazyResult<any> => {
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
