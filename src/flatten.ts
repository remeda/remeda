import { _reduceLazy, LazyResult } from './_reduceLazy';
import { purry } from './purry';

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 *
 * @param items the target array
 * @signature
 *   R.flatten(array)
 * @example
 *    R.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 * @dataFirst
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

/**
 * Flattens `array` a single level deep.
 *
 * @param items the target array
 * @signature
 *   R.flatten()(array)
 * @example
 *    R.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      R.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 * @dataLast
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten() {
  return purry(_flatten, arguments, flatten.lazy);
}

function _flatten<T>(items: Array<T>) {
  return _reduceLazy(items, flatten.lazy());
}

export namespace flatten {
  export function lazy<T>() {
    return (next: T): LazyResult<unknown> => {
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
