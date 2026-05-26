import { purryOn } from "./internal/purryOn";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { isNumber } from "./isNumber";

/**
 * Removes elements from an array and, optionally, inserts new elements in
 * their place.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` elements.
 * - `dropLast` - to skip past the last `n` elements.
 * - `filter` - to shape the array by *value* rather than by *position*.
 * - `swapIndices` - to swap two elements by their indices.
 * - `take` - to keep only the first `n` elements.
 * - `takeLast` - to keep only the last `n` elements.
 *
 * @param data - The array to splice.
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - Optional elements to insert into the array in place of the deleted elements. Defaults to no elements.
 * @signature
 *    splice(items, start, deleteCount, replacement?)
 * @example
 *    splice([1,2,3,4,5,6,7,8], 2, 3); //=> [1,2,6,7,8]
 *    splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
export function splice<T extends IterableContainer>(
  data: T,
  start: number,
  deleteCount: number,
  replacement?: readonly T[number][],
): T[number][];

/**
 * Removes elements from an array and, optionally, inserts new elements in
 * their place.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` elements.
 * - `dropLast` - to skip past the last `n` elements.
 * - `filter` - to shape the array by *value* rather than by *position*.
 * - `swapIndices` - to swap two elements by their indices.
 * - `take` - to keep only the first `n` elements.
 * - `takeLast` - to keep only the last `n` elements.
 *
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - Optional elements to insert into the array in place of the deleted elements. Defaults to no elements.
 * @signature
 *    splice(start, deleteCount, replacement?)(items)
 * @example
 *    pipe([1,2,3,4,5,6,7,8], splice(2, 3)) // => [1,2,6,7,8]
 *    pipe([1,2,3,4,5,6,7,8], splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
export function splice<T extends IterableContainer>(
  start: number,
  deleteCount: number,
  replacement?: readonly NoInfer<T>[number][],
): (data: T) => T[number][];

export function splice(...args: readonly unknown[]): unknown {
  return purryOn(isNumber, spliceImplementation, args);
}

function spliceImplementation<T extends IterableContainer>(
  items: T,
  start: number,
  deleteCount: number,
  replacement: readonly T[number][] = [],
): T[number][] {
  // TODO [>2]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSpliced` here.
  const result = [...items];
  result.splice(start, deleteCount, ...replacement);
  return result;
}
