import { purry } from './purry';
import { NonEmptyArray } from './_types';

type Chunked<T extends ReadonlyArray<unknown> | []> =
  | (T extends
      | readonly [unknown, ...Array<unknown>]
      | readonly [...Array<unknown>, unknown]
      ? never
      : [])
  | NonEmptyArray<NonEmptyArray<T[number]>>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 * @param array the array
 * @param size the length of the chunk
 * @signature
 *    R.chunk(array, size)
 * @example
 *    R.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @data_first
 * @category Array
 */
export function chunk<T extends ReadonlyArray<unknown> | []>(
  array: T,
  size: number
): Chunked<T>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 * @param size the length of the chunk
 * @signature
 *    R.chunk(size)(array)
 * @example
 *    R.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @data_last
 * @category Array
 */
export function chunk<T extends ReadonlyArray<unknown> | []>(
  size: number
): (array: T) => Chunked<T>;

export function chunk() {
  return purry(_chunk, arguments);
}

function _chunk<T>(array: Array<T>, size: number) {
  const ret: Array<Array<T>> = Array.from({
    length: Math.ceil(array.length / size),
  });
  for (let index = 0; index < ret.length; index += 1) {
    ret[index] = array.slice(index * size, (index + 1) * size);
  }
  return ret;
}
