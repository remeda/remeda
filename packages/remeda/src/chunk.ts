import type {
  IfNever,
  IntRange,
  IsNumericLiteral,
  LessThan,
  Subtract,
  ValueOf,
} from "type-fest";
import type { IntRangeInclusive } from "./internal/types/IntRangeInclusive";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import type { NTuple } from "./internal/types/NTuple";
import type { TupleParts } from "./internal/types/TupleParts";
import { isArray } from "./isArray";
import doTransduce from "./internal/doTransduce";

// This prevents typescript from failing on complex arrays and large chunks. It
// allows the typing to remain useful even when very large chunks are needed,
// without loosing fidelity on smaller ones. It was chosen by trial-and-error,
// and given some more wiggle room because the complexity of the array also
// plays a role in when typescript fails to recurse.
// See the type tests for an example.
type MAX_LITERAL_SIZE = 350;

type Chunk<
  T extends IterableContainer,
  N extends number,
> = T extends readonly []
  ? []
  : IsNumericLiteral<N> extends true
    ? LessThan<N, 1> extends true
      ? never
      : LessThan<N, MAX_LITERAL_SIZE> extends true
        ? // The spread here is used as a form of "Simplify" for arrays; without
          // it our return type isn't useful.
          [...LiteralChunk<T, N>]
        : GenericChunk<T>
    : GenericChunk<T>;

type LiteralChunk<
  T,
  N extends number,
  // TupleParts allows us to optimize the algorithm by taking all items up to
  // the rest param, all items after the rest param, and the type of the rest
  // param, in a single recursive scan, so that all other parts of our algorithm
  // don't need to recurse again in order to handle them.
  Parts extends TupleParts<T> = TupleParts<T>,
> =
  | ChunkInfinite<
      // Our result will always have the prefix tuple chunked the same way, so
      // we compute it once here and send it to the main logic below
      ChunkFinite<Parts["prefix"], N>,
      Parts["item"],
      Parts["suffix"],
      N
    >
  // If both the prefix and suffix tuples are empty then our input is a simple
  // array of the form `Array<Item>`. This means it could also be empty, so we
  // need to add the empty output to our return type.
  | ([...Parts["prefix"], ...Parts["suffix"]]["length"] extends 0 ? [] : never);

/**
 * This type **only** works if the input array `T` is a finite tuple (
 * `[number, "abc", true, { a: "hello" }]` etc..., and it doesn't contain a rest
 * parameter). For these inputs the chunked output could be computed as literal
 * finite tuples too.
 */
type ChunkFinite<
  T,
  N extends number,
  // Important! Result is initialized with an empty array (and not `[[]]`)
  // because the result of `chunk` on an empty array is `[]` and not `[[]]`.
  Result = [],
> = T extends readonly [infer Head, ...infer Rest]
  ? // We continue consuming the input tuple recursively item by item.
    ChunkFinite<
      Rest,
      N,
      Result extends [
        ...infer Previous extends Array<Array<unknown>>,
        infer Current extends Array<unknown>,
      ]
        ? // We take a look at the last chunk in the result, this is the
          // "current" chunk where new items would be added, all chunks before
          // it are already full.
          Current["length"] extends N
          ? // The current chunk is full, create a new chunk and put Head in it.
            [...Previous, Current, [Head]]
          : // The current chunk is not full yet, so we add Head to it.
            [...Previous, [...Current, Head]]
        : // This would only happen on the first iteration, when result is
          // still empty. In this case we create the first chunk and put Head
          // in it.
          [[Head]]
    >
  : // We know T is a finite tuple, so the only case where we would reach this
    // is when T is empty, and in that case our results array contains the whole
    // input chunked by N.
    Result;

/**
 * Here lies the main complexity of building the chunk type. It takes the prefix
 * chunks, the rest param item type, and the suffix (not chunked!) and it
 * creates all possible combinations of adding items to the prefix and suffix
 * for all possible scenarios for how many items the rest param "represents".
 */
type ChunkInfinite<
  PrefixChunks,
  Item,
  Suffix extends Array<unknown>,
  N extends number,
> = IfNever<
  Item,
  // The rest param is never when there is no rest param, the whole array is
  // a finite tuple and is represented already by the prefix chunks. Suffix is
  // assumed to be empty in this case.
  PrefixChunks,
  PrefixChunks extends [
    ...infer PrefixFullChunks extends Array<Array<unknown>>,
    infer LastPrefixChunk extends Array<unknown>,
  ]
    ? // When our prefix chunks are not empty it means we need to look at all
      // combinations of mixing the prefix, the suffix, and different counts of
      // the rest param until we cover all possible scenarios.
      | ValueOf<{
            // We want to iterate over all possible padding sizes we can add to
            // the last prefix chunk until we reach N
            // (`0..N-LastPrefixChunk.length`). We need to do this because until
            // the last prefix chunk is full, we need to consider the suffix
            // being part of it too...
            [Padding in IntRangeInclusive<
              0,
              Subtract<N, LastPrefixChunk["length"]>
            >]: [
              ...PrefixFullChunks,
              ...ChunkFinite<
                // Create a new array that would **not** contain a rest param
                // (so it's finite) made of the last prefix chunk, padding from
                // the rest param, and the suffix.
                [...LastPrefixChunk, ...NTuple<Item, Padding>, ...Suffix],
                N
              >,
            ];
          }>
        // Additionally, we need to consider the case where the last prefix
        // chunk **is** full, and follow it with an array of chunks of the rest
        // param (and only them), and then followed by all possible variations
        // of the suffix chunks.
        | [
            ...PrefixFullChunks,
            [
              // Fully padded last prefix chunk
              ...LastPrefixChunk,
              ...NTuple<Item, Subtract<N, LastPrefixChunk["length"]>>,
            ],
            ...Array<NTuple<Item, N>>,
            ...SuffixChunk<Suffix, Item, N>,
          ]
    : // When our prefix chunks are empty we only need to handle the suffix
      [...Array<NTuple<Item, N>>, ...SuffixChunk<Suffix, Item, N>]
>;

/**
 * This type assumes it takes a finite tuple that represents the suffix of our
 * input array. It builds all possible combinations of adding items to the
 * **head** of the suffix in order to pad the suffix until the last chunk is
 * full.
 */
type SuffixChunk<
  T extends Array<unknown>,
  Item,
  N extends number,
> = T extends readonly []
  ? // If we don't have a suffix we simply create a single chunk with all
    // possible non-empty sub-arrays of `Item` up to size `N`.
    [ValueOf<{ [K in IntRangeInclusive<1, N>]: NTuple<Item, K> }>]
  : ValueOf<{
      // When suffix isn't empty we pad the head of the suffix and compute it's
      // chunks for all possible padding sizes.
      [Padding in IntRange<0, N>]: ChunkFinite<
        [...NTuple<Item, Padding>, ...T],
        N
      >;
    }>;

/**
 * This is the legacy type used when we don't know what N is. We can only adjust
 * our output based on if we know for sure that the array is empty or not.
 */
type GenericChunk<T extends IterableContainer> = T extends
  | readonly [...Array<unknown>, unknown]
  | readonly [unknown, ...Array<unknown>]
  ? NonEmptyArray<NonEmptyArray<T[number]>>
  : Array<NonEmptyArray<T[number]>>;

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
 * @lazy
 * @category Array
 */
export function chunk<T extends IterableContainer, N extends number>(
  array: T,
  size: N,
): Chunk<T, N>;
export function chunk<T>(data: Iterable<T>, size: number): Array<Array<T>>;

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
 * @lazy
 * @category Array
 */
export function chunk<N extends number>(
  size: N,
): <T extends Iterable<unknown>>(
  array: T,
) => T extends IterableContainer ? Chunk<T, N> : Iterable<Array<T>>;

export function chunk(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(chunkImplementation, lazyImplementation, args);
}

function chunkImplementation<T>(
  data: Iterable<T>,
  size: number,
): Array<Array<T>> {
  if (!isArray(data)) {
    return [...lazyImplementation(data, size)];
  }

  if (size < 1) {
    throw new RangeError(
      `chunk: A chunk size of '${size.toString()}' would result in an infinite array'`,
    );
  }

  if (data.length === 0) {
    return [];
  }

  if (size >= data.length) {
    // Optimized for when there is only one chunk.
    return [[...data]];
  }

  const chunks = Math.ceil(data.length / size);

  // eslint-disable-next-line unicorn/no-new-array -- This is OK, a sparse array allows us to handle very large arrays more efficiently.
  const result = new Array<Array<T>>(chunks);

  if (size === 1) {
    // Optimized for when we don't need slice.
    for (const [index, item] of data.entries()) {
      result[index] = [item];
    }
  } else {
    for (let index = 0; index < chunks; index += 1) {
      const start = index * size;
      result[index] = data.slice(start, start + size);
    }
  }

  return result;
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  size: number,
): Iterable<Array<T>> {
  if (size < 1) {
    throw new RangeError(`chunk: Invalid chunk size '${size.toString()}'`);
  }

  if (size === 1) {
    for (const item of data) {
      yield [item];
    }
    return;
  }

  let nextChunk: Array<T> = [];

  for (const item of data) {
    nextChunk.push(item);

    if (nextChunk.length === size) {
      yield nextChunk;
      nextChunk = [];
    }
  }

  if (nextChunk.length > 0) {
    yield nextChunk;
  }
}
