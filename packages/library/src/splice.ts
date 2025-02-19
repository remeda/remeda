import { purry } from "./purry";

/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param items - The array to splice.
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the deleted elements.
 * @signature
 *    R.splice(items, start, deleteCount, replacement)
 * @example
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, []); //=> [1,2,6,7,8]
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
export function splice<T>(
  items: ReadonlyArray<T>,
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>,
): Array<T>;

/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the deleted elements.
 * @signature
 *    R.splice(start, deleteCount, replacement)(items)
 * @example
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [])) // => [1,2,6,7,8]
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
export function splice<T>(
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>,
): (items: ReadonlyArray<T>) => Array<T>;

export function splice(...args: ReadonlyArray<unknown>): unknown {
  return purry(spliceImplementation, args);
}

function spliceImplementation<T>(
  items: ReadonlyArray<T>,
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>,
): Array<T> {
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSpliced` here.
  const result = [...items];
  result.splice(start, deleteCount, ...replacement);
  return result;
}
