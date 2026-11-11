import { purry1 } from "./internal/purryByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { ReorderedArray } from "./internal/types/ReorderedArray";

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @param data - The array to shuffle.
 * @signature
 *    shuffle(data)
 * @example
 *    shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @dataFirst
 * @category Array
 */
export function shuffle<T extends IterableContainer>(
  data: T,
): ReorderedArray<T>;

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @signature
 *    shuffle()(data)
 * @example
 *    pipe([4, 2, 7, 5], shuffle()) // => [7, 5, 4, 2]
 * @dataLast
 * @category Array
 */
export function shuffle(): <T extends IterableContainer>(
  data: T,
) => ReorderedArray<T>;

export function shuffle(data?: unknown): unknown {
  return purry1(shuffleImplementation, arguments.length, data);
}

function shuffleImplementation<T>(data: readonly T[]): T[] {
  const result = data.concat();
  for (let index = 0; index < data.length; index++) {
    const rand = index + Math.floor(Math.random() * (data.length - index));
    const value = result[rand]!;
    result[rand] = result[index]!;
    result[index] = value;
  }
  return result;
}
