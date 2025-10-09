import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

/**
 * Checks if any of the items in the candidate array are included in the data
 * array. This is a wrapper around `Array.prototype.includes` and thus relies
 * on the same equality checks (reference equality, e.g. `===`).
 *
 * @param data - The array to search in.
 * @param candidates - The items to look for.
 * @returns `true` if any of the candidates are found in the data array,
 * `false` otherwise.
 * @signature
 *   R.includesAny(data, candidates)
 * @example
 *   R.includesAny([1, 2, 3], [2, 4]); // => true
 *   R.includesAny([1, 2, 3], [4, 5]); // => false
 *   R.includesAny(['a', 'b'], ['c', 'd']); // => false
 *   R.includesAny(['a', 'b'], ['a', 'c']); // => true
 * @dataFirst
 * @category Array
 */
export function includesAny<T>(
  data: IterableContainer<T>,
  candidates: IterableContainer,
): boolean;

/**
 * Checks if any of the items in the candidate array are included in the data
 * array. This is a wrapper around `Array.prototype.includes` and thus relies
 * on the same equality checks (reference equality, e.g. `===`).
 *
 * @param candidates - The items to look for.
 * @returns A function that takes a data array and returns `true` if any of the
 * candidates are found in the data array, `false` otherwise.
 * @signature
 *   R.includesAny(candidates)(data)
 * @example
 *   R.pipe([1, 2, 3], R.includesAny([2, 4])); // => true
 *   R.pipe([1, 2, 3], R.includesAny([4, 5])); // => false
 *   R.pipe(['a', 'b'], R.includesAny(['c', 'd'])); // => false
 *   R.pipe(['a', 'b'], R.includesAny(['a', 'c'])); // => true
 * @dataLast
 * @category Array
 */
export function includesAny<T>(
  candidates: IterableContainer,
): (data: IterableContainer<T>) => boolean;

export function includesAny(...args: ReadonlyArray<unknown>): unknown {
  return purry(includesAnyImplementation, args);
}

const includesAnyImplementation = (
  data: ReadonlyArray<unknown>,
  candidates: ReadonlyArray<unknown>,
): boolean => candidates.some((candidate) => data.includes(candidate));