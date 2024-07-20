import { type IntRange } from "type-fest";
import type { IterableContainer, NonEmptyArray } from "./internal/types";
import { purry } from "./purry";

type Chunked<T extends IterableContainer, N extends number> = number extends N
  ? T[number] extends never
    ? []
    : T extends
          | readonly [...Array<unknown>, unknown]
          | readonly [unknown, ...Array<unknown>]
      ? NonEmptyArray<NonEmptyArray<T[number]>>
      : Array<NonEmptyArray<T[number]>>
  : ChunkedCounted<T, N>;

type ChunkedCounted<
  T extends IterableContainer,
  N extends number,
  Output extends Array<Array<unknown>> = [],
> = T["length"] extends 0
  ? Output
  : T extends readonly [infer Head, ...infer Rest]
    ? ChunkedCounted<
        Rest,
        N,
        Output extends [
          ...infer Previous extends Array<Array<unknown>>,
          infer Current extends Array<unknown>,
        ]
          ? Current["length"] extends N
            ? [...Previous, Current, [Head]]
            : [...Previous, [...Current, Head]]
          : [[Head]]
      >
    : Output extends [
          ...infer Previous extends Array<Array<unknown>>,
          infer Current extends Array<unknown>,
        ]
      ? Current["length"] extends N
        ? [
            ...Output,
            ...Array<NTuple<T[number], N>>,
            AtMostArray<T[number], N> | NTuple<T[number], N>,
          ]
        : ChunkedCounted<T, N, [...Previous, [...Current, T[number]]]>
      : [
          ...Array<NTuple<T[number], N>>,
          AtMostArray<T[number], N> | NTuple<T[number], N>,
        ];

type NTuple<
  T,
  N extends number,
  Output extends Array<T> = [],
> = Output["length"] extends N ? Output : NTuple<T, N, [T, ...Output]>;

type AtMostArray<T, N extends number> = NTuple<T, IntRange<1, N>>;

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
