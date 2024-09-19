import type { And, ArraySplice, IsNegative, Sum } from "type-fest";
import type { IterableContainer } from "./internal/types";
import { purry } from "./purry";

type Splice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
  PositiveStart extends number = And<
    number extends T["length"] ? false : true,
    IsNegative<Start>
  > extends true
    ? // If Start is negative, *and* T is not a variable-length tuple, we can
      // compute PositiveStart = T["length"] + Start.
      Sum<T["length"], Start> extends infer SumResult extends number
      ? number extends SumResult
        ? // type-fest Sum returns number when the sum is negative.
          0
        : SumResult
      : never
    : Start,
> = ArraySplice<T, PositiveStart, DeleteCount, Replacement>;

/**
 * Removes elements from an array and inserts new elements in their place.
 *
 * Equivalent to `items.toSpliced(start, deleteCount, ...replacement)`.
 *
 * @param items - The array to splice.
 * @param start - The index from which to start removing elements. If negative,
 * it is counted from the end of the array. If it's at least `items.length`,
 * no elements are removed.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the
 * deleted elements.
 * @signature
 *    R.splice(items, start, deleteCount, replacement)
 * @example
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, []); //=> [1,2,6,7,8]
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
export function splice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
>(
  items: T,
  start: Start,
  deleteCount: DeleteCount,
  replacement: Replacement,
): Splice<T, Start, DeleteCount, Replacement>;

/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * Equivalent to `items.toSpliced(start, deleteCount, ...replacement)`.
 *
 * @param start - The index from which to start removing elements. If negative,
 * it is counted from the end of the array. If it's at least `items.length`,
 * no elements are removed.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the
 * deleted elements.
 * @signature
 *    R.splice(start, deleteCount, replacement)(items)
 * @example
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [])) // => [1,2,6,7,8]
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
export function splice<
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
>(
  start: Start,
  deleteCount: DeleteCount,
  replacement: Replacement,
): <T extends IterableContainer>(
  items: T,
) => Splice<T, Start, DeleteCount, Replacement>;

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
