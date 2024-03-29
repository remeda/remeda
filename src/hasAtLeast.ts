import { type IterableContainer } from "./_types";
import { purry } from "./purry";

type ArrayMinN<
  T extends IterableContainer,
  N extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = number extends N
  ? // We can only compute the type for a literal number!
    T
  : Iteration["length"] extends N
    ? T
    : T extends readonly []
      ? never
      : T extends [infer Head, ...infer Rest]
        ? [Head, ...ArrayMinN<Rest, N, [Head, ...Iteration]>]
        : T extends ReadonlyArray<infer Item>
          ? [Item, ...ArrayMinN<T, N, [Item, ...Iteration]>]
          : never;

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
export function hasAtLeast<T extends IterableContainer, N extends number>(
  data: IterableContainer | T,
  minimum: N,
): data is ArrayMinN<T, N>;

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
export function hasAtLeast<N extends number>(
  minimum: N,
): <T extends IterableContainer>(
  data: IterableContainer | T,
) => data is ArrayMinN<T, N>;

export function hasAtLeast(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasAtLeastImplementation, args);
}

const hasAtLeastImplementation = <
  T extends IterableContainer,
  N extends number,
>(
  data: IterableContainer | T,
  minimum: N,
): data is ArrayMinN<T, N> => data.length >= minimum;
