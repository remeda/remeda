import {
  type IfNever,
  type IntRange,
  type IsNumericLiteral,
  type LessThan,
  type Subtract,
  type ValueOf,
} from "type-fest";
import type {
  IterableContainer,
  NonEmptyArray,
  NTuple,
  TupleParts,
} from "./internal/types";
import { purry } from "./purry";

// This prevents typescript from failing on complex arrays and large chunks. It
// allows the typing to remain useful even when very large chunks are needed,
// without loosing fidelity on smaller ones. It was chosen by trial-and-error,
// and given some more wiggle room because the complexity of the array also
// plays a role in when typescript fails to recurse.
// See the type tests for an example.
type MAX_LITERAL_SIZE = 350;

type Chunked<
  T extends IterableContainer,
  N extends number,
> = T extends readonly []
  ? []
  : IsNumericLiteral<N> extends true
    ? LessThan<N, 1> extends true
      ? never
      : LessThan<N, MAX_LITERAL_SIZE> extends true
        ? [...ChunkedWithLiteral<TupleParts<T>, N>]
        : ChunkedWithNumber<T>
    : ChunkedWithNumber<T>;

type ChunkedWithLiteral<
  T extends {
    prefix: Array<unknown>;
    item: unknown;
    suffix: Array<unknown>;
  },
  N extends number,
> =
  | VariableSizeChunked<
      FixedSizeChunked<T["prefix"], N>,
      T["item"],
      T["suffix"],
      N
    >
  | ([...T["prefix"], ...T["suffix"]]["length"] extends 0 ? [] : never);

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
  T,
  Item,
  Suffix extends Array<unknown>,
  N extends number,
> = IfNever<
  Item,
  T,
  T extends [
    ...infer PrefixFullChunks extends Array<Array<unknown>>,
    infer LastPrefixChunk extends Array<unknown>,
  ]
    ?
        | ValueOf<{
            [K in InclusiveIntRange<
              0,
              Subtract<N, LastPrefixChunk["length"]>
            >]: [
              ...PrefixFullChunks,
              ...FixedSizeChunked<
                [...LastPrefixChunk, ...NTuple<Item, K>, ...Suffix],
                N
              >,
            ];
          }>
        | [
            ...PrefixFullChunks,
            [
              ...LastPrefixChunk,
              ...NTuple<Item, Subtract<N, LastPrefixChunk["length"]>>,
            ],
            ...Array<NTuple<Item, N>>,
            ...ChunkedSuffixes<Suffix, Item, N>,
          ]
    : [...Array<NTuple<Item, N>>, ...ChunkedSuffixes<Suffix, Item, N>]
>;

type ChunkedSuffixes<
  T extends Array<unknown>,
  Item,
  N extends number,
> = T extends readonly []
  ? [ValueOf<{ [K in InclusiveIntRange<1, N>]: NTuple<Item, K> }>]
  : ValueOf<{
      [K in IntRange<0, N>]: FixedSizeChunked<[...NTuple<Item, K>, ...T], N>;
    }>;

type ChunkedWithNumber<T extends IterableContainer> = T extends
  | readonly [...Array<unknown>, unknown]
  | readonly [unknown, ...Array<unknown>]
  ? NonEmptyArray<NonEmptyArray<T[number]>>
  : Array<NonEmptyArray<T[number]>>;

type InclusiveIntRange<From extends number, To extends number> =
  | IntRange<From, To>
  | To;

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
