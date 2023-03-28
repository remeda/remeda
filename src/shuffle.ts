import { purry } from './purry';

/**
 * Creates an array of shuffled values, using the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 * @param items the array to shuffle
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @category Array
 * @data_first
 */
export function shuffle<T>(items: ReadonlyArray<T>): Array<T>;

/**
 * Creates an array of shuffled values, using the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 * @signature
 *    R.shuffle()(array)
 * @example
 *    R.pipe([4, 2, 7, 5], R.shuffle()) // => [7, 5, 4, 2]
 * @category Array
 * @data_last
 */
export function shuffle<T>(): (items: ReadonlyArray<T>) => Array<T>;

export function shuffle() {
  return purry(_shuffle, arguments);
}

function _shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = items.slice();
  for (let index = 0; index < items.length; index += 1) {
    const rand = index + Math.floor(Math.random() * (items.length - index));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}
