import { type IfNever, type IntRange, type ValueOf } from "type-fest";
import type {
  IterableContainer,
  NonEmptyArray,
  NTuple,
  TupleParts,
} from "./internal/types";
import { purry } from "./purry";

type Chunked<
  T extends IterableContainer,
  N extends number,
> = T extends readonly []
  ? []
  : number extends N
    ? T extends
        | readonly [...Array<unknown>, unknown]
        | readonly [unknown, ...Array<unknown>]
      ? NonEmptyArray<NonEmptyArray<T[number]>>
      : Array<NonEmptyArray<T[number]>>
    : ChunkedWithLiteral<T, N>;

type ChunkedWithLiteral<T, N extends number> =
  TupleParts<T> extends {
    prefix: infer Prefix extends Array<unknown>;
    item: infer Item;
    suffix: infer Suffix extends Array<unknown>;
  }
    ? IfNever<
        Item,
        FixedSizeChunked<Prefix, N>,
        | VariableSizeChunked<FixedSizeChunked<Prefix, N>, N, Item, Suffix>
        | ([...Prefix, ...Suffix]["length"] extends 0 ? [] : never)
      >
    : "ERROR: Failed to split input array into it's parts";

type FixedSizeChunked<T, N extends number, Result = []> = T extends readonly [
  infer Head,
  ...infer Rest,
]
  ? FixedSizeChunked<
      Rest,
      N,
      Result extends [
        ...infer Previous extends Array<Array<unknown>>,
        infer Current extends Array<unknown>,
      ]
        ? Current["length"] extends N
          ? [...Previous, Current, [Head]]
          : [...Previous, [...Current, Head]]
        : [[Head]]
    >
  : Result;

type VariableSizeChunked<
  ChunkedPrefix,
  N extends number,
  RestItem,
  Suffix extends Array<unknown>,
> = ChunkedPrefix extends [
  ...infer PrefixFullChunks extends Array<Array<unknown>>,
  infer LastPrefixChunk extends Array<unknown>,
]
  ?
      | ValueOf<{
          [K in
            | IntRange<0, NumMissingItems<LastPrefixChunk, N>>
            | NumMissingItems<LastPrefixChunk, N>]: [
            ...PrefixFullChunks,
            ...FixedSizeChunked<
              [...LastPrefixChunk, ...NTuple<RestItem, K>, ...Suffix],
              N
            >,
          ];
        }>
      | [
          ...PrefixFullChunks,
          [
            ...LastPrefixChunk,
            ...NTuple<RestItem, NumMissingItems<LastPrefixChunk, N>>,
          ],
          ...Array<NTuple<RestItem, N>>,
          ...ChunkedSuffixes<Suffix, N, RestItem>,
        ]
  : [...Array<NTuple<RestItem, N>>, ...ChunkedSuffixes<Suffix, N, RestItem>];

type ChunkedSuffixes<T extends Array<unknown>, N extends number, Filler> =
  FixedSizeChunked<T, N> extends [
    ...Array<unknown>,
    infer Last extends Array<unknown>,
  ]
    ? ValueOf<{
        [K in IntRange<0, NumMissingItems<Last, N>>]: FixedSizeChunked<
          [...NTuple<Filler, K>, ...T],
          N
        >;
      }>
    : [ValueOf<{ [K in IntRange<1, N> | N]: NTuple<Filler, K, T> }>];

type NumMissingItems<
  T extends Array<unknown>,
  N extends number,
  Iteration extends Array<unknown> = [],
> = [...Iteration, ...T]["length"] extends N
  ? Iteration["length"]
  : NumMissingItems<T, N, [unknown, ...Iteration]>;

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
export function chunk<T extends IterableContainer, N extends number>(
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
export function chunk<N extends number>(
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
