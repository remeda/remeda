import type {
  ArraySplice,
  GreaterThan,
  IfNever,
  IsLiteral,
  IsNegative,
  Subtract,
  Sum,
} from "type-fest";
import type { CoercedArray } from "./internal/types/CoercedArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type IfLiteral<N extends number, Fallback> = number extends N ? Fallback : N;

type PositiveIndex<T extends IterableContainer, N extends number> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  N extends unknown
    ? IsNegative<N> extends true
      ? number extends T["length"]
        ? number
        : // type-fest `Sum` returns `number` if the result is negative.
          IfLiteral<Sum<T["length"], N>, 0>
      : GreaterThan<N, T["length"]> extends true
        ? T["length"]
        : N
    : never;

type ClampedLength<
  T extends IterableContainer,
  Offset extends number,
  Length extends number,
> =
  IsNegative<Length> extends true
    ? 0
    : number extends T["length"]
      ? number
      : GreaterThan<Sum<Offset, Length>, T["length"]> extends true
        ? // type-fest `Subtract` returns `number` if the result is negative.
          IfLiteral<Subtract<T["length"], Offset>, 0>
        : Length;

type FixedLengthSplice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
  PositiveStart extends number = PositiveIndex<T, Start>,
> =
  // Turn this to a distributive conditional type; see `extends unknown` note above.
  PositiveStart extends unknown
    ? ArraySplice<
        T,
        PositiveStart,
        ClampedLength<T, PositiveStart, DeleteCount>,
        Replacement
      >
    : never;

/** Collapse the types of two tuples into a single array. */
type CollapseTuples<A extends IterableContainer, B extends IterableContainer> =
  A extends ReadonlyArray<infer AItem>
    ? B extends ReadonlyArray<infer BItem>
      ? IfNever<AItem | BItem, ReadonlyArray<unknown>, Array<AItem | BItem>>
      : never
    : never;

type LiteralNumberSplice<
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
        // TODO: Is a better type is possible? See tests.
        CollapseTuples<T, Replacement>
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
        // TODO: Is a better type is possible? See tests.
        CollapseTuples<T, Replacement>
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

type Splice<
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
> = [IsLiteral<Start>, IsLiteral<DeleteCount>] extends [true, true]
  ? LiteralNumberSplice<T, Start, DeleteCount, Replacement>
  : CollapseTuples<T, Replacement>;

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
  T extends IterableContainer,
  Start extends number,
  DeleteCount extends number,
  Replacement extends IterableContainer,
>(
  start: Start,
  deleteCount: DeleteCount,
  replacement: Replacement,
): (items: T) => Splice<T, Start, DeleteCount, Replacement>;

export function splice(...args: ReadonlyArray<unknown>): unknown {
  return purry(spliceImplementation, args);
}

function spliceImplementation(
  items: IterableContainer,
  start: number,
  deleteCount: number,
  replacement: IterableContainer,
): IterableContainer {
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSpliced` here.
  const result = [...items];
  result.splice(start, deleteCount, ...replacement);
  return result;
}
