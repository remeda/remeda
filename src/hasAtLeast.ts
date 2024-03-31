import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type ArraySetRequired<
  T extends IterableContainer,
  N extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = Iteration["length"] extends N
  ? // We've reached the end condition for the recursion, T has all N items
    // required.
    T
  : T extends readonly []
    ? // The array doesn't have enough items to have N required items.
      never
    : T extends [infer Head, ...infer Rest]
      ? // The input is a *MUTABLE* tuple, we copy the head to the output and
        // recurse on rest of the tuple...
        [Head, ...ArraySetRequired<Rest, N, [unknown, ...Iteration]>]
      : T extends readonly [infer Head, ...infer Rest]
        ? // The input is a *READONLY* tuple, we copy the head to the output and
          // recurse on rest of the tuple...
          readonly [Head, ...ArraySetRequired<Rest, N, [unknown, ...Iteration]>]
        : T extends Array<infer Item>
          ? // The input is a regular **MUTABLE** array, we need to fill the
            // output with items until we reach the required size.
            [Item, ...ArraySetRequired<T, N, [unknown, ...Iteration]>]
          : T extends ReadonlyArray<infer Item>
            ? // The input is a regular **READONLY** array, we need to fill the
              // output with items until we reach the required size.
              readonly [
                Item,
                ...ArraySetRequired<T, N, [unknown, ...Iteration]>,
              ]
            : // The input is not a tuple, an array or an empty array, what is
              // it?!
              never;

// TODO: In V2 we need to enable this type and use it as the type for the
// `minimum` param to prevent usage of the guard when it's output can't be
// narrowed properly, and then add an overloaded function that just returns
// `true` with the original signature to enable a non-narrowing version of this
// function for those cases.
// type Literal<N extends number> = number extends N ? never : N;

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
): data is ArraySetRequired<T, N>;

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
) => data is ArraySetRequired<T, N>;

export function hasAtLeast(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasAtLeastImplementation, args);
}

const hasAtLeastImplementation = <
  T extends IterableContainer,
  N extends number,
>(
  data: IterableContainer | T,
  minimum: N,
): data is ArraySetRequired<T, N> => data.length >= minimum;
