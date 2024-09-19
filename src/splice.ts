import type {
  ArraySplice,
  GreaterThan,
  IsNegative,
  Subtract,
  Sum,
} from "type-fest";
import type {
  CoercedArray,
  IterableContainer,
  TupleParts,
} from "./internal/types";
import { purry } from "./purry";

type FixedLengthSplice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
  PositiveStart extends number = IsNegative<Start> extends false
    ? Start
    : number extends T["length"]
      ? // Can't compute negative start index.
        number
      : Sum<T["length"], Start> extends infer SumResult extends number
        ? number extends SumResult
          ? // type-fest Sum returns number when the sum is negative.
            0
          : SumResult
        : never,
  ClampedDeleteCount extends number = IsNegative<DeleteCount> extends true
    ? 0
    : number extends T["length"]
      ? // Don't bother clamping in this case.
        number
      : GreaterThan<Sum<PositiveStart, DeleteCount>, T["length"]> extends true
        ? Subtract<
            T["length"],
            PositiveStart
          > extends infer SubtractResult extends number
          ? number extends SubtractResult
            ? // type-fest Subtract returns number when the difference is negative.
              0
            : SubtractResult
          : never
        : DeleteCount,
> = ArraySplice<T, PositiveStart, ClampedDeleteCount, Replacement>;

type Splice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
> = TupleParts<T>["item"] extends never
  ? FixedLengthSplice<T, Start, DeleteCount, Replacement>
  : IsNegative<Start> extends true
    ? // type-fest Sum returns number when the sum is negative.
      number extends Sum<TupleParts<T>["suffix"]["length"], Start>
      ? // Splice cuts into the variable-length part.
        T
      : // Splice is solely in the suffix.
        [
          ...TupleParts<T>["prefix"],
          ...CoercedArray<TupleParts<T>["item"]>,
          ...FixedLengthSplice<
            TupleParts<T>["suffix"],
            Start,
            DeleteCount,
            Replacement
          >,
        ]
    : GreaterThan<
          Sum<Start, DeleteCount>,
          TupleParts<T>["prefix"]["length"]
        > extends true
      ? // Splice cuts into the variable-length part.
        T
      : // Splice is solely in the prefix.
        [
          ...FixedLengthSplice<
            TupleParts<T>["prefix"],
            Start,
            DeleteCount,
            Replacement
          >,
          ...CoercedArray<TupleParts<T>["item"]>,
          ...TupleParts<T>["suffix"],
        ];

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
