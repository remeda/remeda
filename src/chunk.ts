import { type IntRange, type ValueOf } from "type-fest";
import type {
  IterableContainer,
  NonEmptyArray,
  NTuple,
} from "./internal/types";
import { purry } from "./purry";

type Chunked<T extends IterableContainer, N extends number> = number extends N
  ? T[number] extends never
    ? []
    : T extends
          | readonly [...Array<unknown>, unknown]
          | readonly [unknown, ...Array<unknown>]
      ? NonEmptyArray<NonEmptyArray<T[number]>>
      : Array<NonEmptyArray<T[number]>>
  : ChunkedWithLiteral<T, N>;

/**
 * When N is literal we can create a much more refined return type for chunk by
 * ensuring that the output chunks are exactly of size N. We also take the input
 * shape itself (and not just the items in the array) to make further assurances
 * on the output type.
 */
type ChunkedWithLiteral<
  T extends IterableContainer,
  N extends number,
  Output extends Array<Array<unknown>> = [],
> = T["length"] extends 0
  ? // If we consume the whole input (or it was empty to begin with) Output
    // contains the exact chunks.
    Output
  : T extends readonly [infer Head, ...infer Rest]
    ? // While the input has a prefix we remove the prefix and add it to the
      // output recursively.
      ChunkedWithLiteral<
        Rest,
        N,
        Output extends [
          ...infer Previous extends Array<Array<unknown>>,
          infer Current extends Array<unknown>,
        ]
          ? // When Output isn't empty we are already in the middle of a chunk
            // so we can look into it and decide where to put the next item.
            Current["length"] extends N
            ? [
                // If the current chunk is already full we start the next chunk
                ...Previous,
                Current,
                [Head],
              ]
            : [
                // Otherwise we add the item to the last chunk and continue.
                ...Previous,
                [...Current, Head],
              ]
          : [
              // But if output is empty we are in the first iteration of our
              // recursion and need to create the initial chunk.
              [Head],
            ]
      >
    : // If the input is a simple array (or we reached the rest param of the
      // tuple) we no longer need to recurse. Instead we now need to build the
      // output based on what Output already contains.
      Output extends [
          ...infer Previous extends Array<Array<unknown>>,
          infer Current extends Array<unknown>,
        ]
      ? // If Output contains anything it means that there are elements at the
        // start of the input that we need to address when building the output.
        Current["length"] extends N
        ? [
            // If the last chunk is full it means that output represents a fixed
            // preset of chunks that are ensured to always be part of the
            // output.
            ...Output,
            ...Array<NTuple<T[number], N>>,
            BoundedArray<T[number], N>,
          ]
        : // The most complex output is when the last chunk isn't full yet. It
          // requires us to split the output type into 2 possible outputs:
          | [
                // When the input is longer and would make Output the *first*
                // element in our output array.
                ...Previous,
                NTuple<T[number], N, Current>,
                ...Array<NTuple<T[number], N>>,
                BoundedArray<T[number], N>,
              ]
            | [
                // When the input would contain up to N elements, so that the
                // Output we already built represents the *last* (and only)
                // element of the output
                ...Previous,
                BoundedArray<T[number], N, Current>,
              ]
      :
          | [
              // If the output is empty we are dealing with a simple array, this
              // is the "classic" chunk output where our output contains a set
              // of chunks of exactly N elements, followed by a final element
              // which might contain between 1 and N elements.
              ...Array<NTuple<T[number], N>>,
              BoundedArray<T[number], N>,
            ]
          // Or it could either be empty (when the array is empty)
          | [];

/**
 * Creates a union of arrays of length 1 to N (inclusive) with elements of type
 * T. It also takes an optional Prefix that would be taken into account when
 * computing the length of the arrays.
 *
 * N is assumed to be a single literal value. Prefix is assumed to be a fixed-
 * sized tuple.
 */
type BoundedArray<
  T,
  N extends number,
  Prefix extends Array<unknown> = [],
> = ValueOf<{ [K in IntRange<1, N> | N]: NTuple<T, K, Prefix> }>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param array - The array.
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(array, size)
 * @example
 *    R.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @dataFirst
 * @category Array
 */
export function chunk<T extends IterableContainer, const N extends number>(
  array: T,
  size: N,
): Chunked<T, N>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(size)(array)
 * @example
 *    R.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @dataLast
 * @category Array
 */
export function chunk<const N extends number>(
  size: N,
): <T extends IterableContainer>(array: T) => Chunked<T, N>;

export function chunk(...args: ReadonlyArray<unknown>): unknown {
  return purry(chunkImplementation, args);
}

function chunkImplementation<T>(
  array: ReadonlyArray<T>,
  size: number,
): Array<Array<T>> {
  if (size < 1) {
    throw new RangeError(
      `chunk: A chunk size of '${size}' would result in an infinite array`,
    );
  }

  const ret: Array<Array<T>> = [];
  for (let offset = 0; offset < array.length; offset += size) {
    ret.push(array.slice(offset, offset + size));
  }
  return ret;
}
