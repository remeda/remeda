import { type IterableContainer } from "./_types";
import { purry } from "./purry";

/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param data - The first items, these would be at the beginning of the new
 * array.
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(data, other);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
export function concat<
  T extends IterableContainer,
  S extends IterableContainer,
>(data: T, other: S): [...T, ...S];

/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
export function concat<S extends IterableContainer>(
  other: S,
): <T extends IterableContainer>(data: T) => [...T, ...S];

export function concat(...args: ReadonlyArray<unknown>): unknown {
  return purry(concatImplementation, args);
}

const concatImplementation = <
  T extends IterableContainer,
  S extends IterableContainer,
>(
  data: T,
  other: S,
): [...T, ...S] => [...data, ...other];
