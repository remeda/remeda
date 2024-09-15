import type { IterableContainer, ReorderedArray } from "./internal/types";
import { purry } from "./purry";

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @param items - The array to shuffle.
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @dataFirst
 * @category Array
 */
export function shuffle<T extends IterableContainer>(
  items: T,
): ReorderedArray<T>;

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @signature
 *    R.shuffle()(array)
 * @example
 *    R.pipe([4, 2, 7, 5], R.shuffle()) // => [7, 5, 4, 2]
 * @dataLast
 * @category Array
 */
export function shuffle(): <T extends IterableContainer>(
  items: T,
) => ReorderedArray<T>;

export function shuffle(...args: ReadonlyArray<unknown>): unknown {
  return purry(shuffleImplementation, args);
}

function shuffleImplementation<T>(items: ReadonlyArray<T>): Array<T> {
  const result = [...items];
  for (let index = 0; index < items.length; index++) {
    const rand = index + Math.floor(Math.random() * (items.length - index));
    const value = result[rand]!;
    result[rand] = result[index]!;
    result[index] = value;
  }
  return result;
}
