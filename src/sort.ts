import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type Sorted<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param items - The array to sort.
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(items, cmp)
 * @example
 *    R.sort([4, 2] as [number, number], (a, b) => a - b) // [2, 4] typed [number, number]
 * @dataFirst
 * @category Array
 */
export function sort<T extends IterableContainer>(
  items: T,
  cmp: (a: T[number], b: T[number]) => number,
): Sorted<T>;

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(cmp)(items)
 * @example
 *    R.pipe([4, 2] as [number, number], R.sort((a, b) => a - b)) // => [2, 4] typed [number, number]
 * @dataLast
 * @category Array
 */
export function sort<T extends IterableContainer>(
  cmp: (a: T[number], b: T[number]) => number,
): (items: T) => Sorted<T>;

export function sort(): unknown {
  return purry(sortImplementation, arguments);
}

function sortImplementation<T extends IterableContainer>(
  items: T,
  cmp: (a: T[number], b: T[number]) => number,
): Sorted<T> {
  const ret = items.slice();
  ret.sort(cmp);
  return ret as Sorted<T>;
}
