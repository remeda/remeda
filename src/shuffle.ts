import { purry } from './purry';

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 * @param items the array to shuffle
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @category Array
 * @dataFirst
 */
export function shuffle<T>(items: ReadonlyArray<T>): Array<T>;

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 * @signature
 *    R.shuffle()(array)
 * @example
 *    R.pipe([4, 2, 7, 5], R.shuffle()) // => [7, 5, 4, 2]
 * @category Array
 * @dataLast
 */
export function shuffle<T>(): (items: ReadonlyArray<T>) => Array<T>;

export function shuffle() {
  return purry(_shuffle, arguments);
}

function _shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = items.slice();
  for (let index = 0; index < items.length; index += 1) {
    const rand = index + Math.floor(Math.random() * (items.length - index));
    const value = result[rand]!;
    result[rand] = result[index]!;
    result[index] = value;
  }
  return result;
}
