import type {
  FixedLengthArray,
  IsEqual,
  IsNever,
  NonNegativeInteger,
  Or,
  Writable,
} from "type-fest";
import type { CoercedArray } from "./internal/types/CoercedArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NTuple } from "./internal/types/NTuple";
import type { PartialArray } from "./internal/types/PartialArray";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type Sampled<T extends IterableContainer, N extends number> =
  Or<IsEqual<N, 0>, IsEqual<T["length"], 0>> extends true
    ? // Short-circuit on trivial inputs.
      []
    : IsNever<NonNegativeInteger<N>> extends true
      ? SampledPrimitive<T>
      : IsLongerThan<T, N> extends true
        ? SampledLiteral<T, N>
        : // If our tuple can never fulfil the sample size the only valid sample
          // is the whole input tuple. Because it's a shallow clone we also
          // strip any readonly-ness.
          Writable<T>;

/**
 * When N is not a non-negative integer **literal** we can't use it in our
 * reconstructing logic so we fallback to a simpler definition of the output of
 * sample, which is any sub-tuple shape of T, of **any length**.
 */
type SampledPrimitive<T extends IterableContainer> = [
  ...FixedSubTuples<TupleParts<T>["required"]>,
  // TODO: This might be accurate, but We currently have no tests that check optional elements!
  ...PartialArray<FixedSubTuples<TupleParts<T>["optional"]>>,
  ...CoercedArray<TupleParts<T>["item"]>,
  ...FixedSubTuples<TupleParts<T>["suffix"]>,
];

/**
 * Knowing N is a non-negative literal integer we can construct all sub-tuples
 * of T that are exactly N elements long.
 */
type SampledLiteral<T extends IterableContainer, N extends number> =
  | Extract<
      FixedSubTuples<
        [
          ...TupleParts<T>["required"],
          // TODO: This deliberately ignores optional elements which we don't have tests for either. In order to handle optional elements we can treat the "optional" tuple-part as more required elements.
          // We add N elements of the `item` type to the tuple so that we
          // consider any combination possible of elements of the prefix items,
          // any amount of rest items, and suffix items.
          ...(IsNever<TupleParts<T>["item"]> extends true
            ? []
            : NTuple<TupleParts<T>["item"], N>),
          ...TupleParts<T>["suffix"],
        ]
      >,
      // This is just [unknown, unknown, ..., unknown] with N elements.
      FixedLengthArray<unknown, N>
    >
  // In addition to all sub-tuples of length N, we also need to consider all
  // tuples where the input is shorter than N. This will contribute exactly
  // one sub-tuple at each length from the minimum length of T and up to N-1.
  | SubSampled<
      TupleParts<T>["required"],
      // TODO: This deliberately ignores optional elements which we don't have tests for either. In order to handle optional elements we can treat the "optional" tuple-part as more required elements.
      TupleParts<T>["item"],
      TupleParts<T>["suffix"],
      N
    >;

// We want to create a union of all sub-tuples where we incrementally add an
// additional element of the type of the rest element in the middle between the
// prefix and suffix until we "fill" the tuple to size N.
type SubSampled<
  Prefix extends ReadonlyArray<unknown>,
  Item,
  Suffix extends ReadonlyArray<unknown>,
  N extends number,
> =
  IsLongerThan<[...Prefix, ...Suffix], N> extends true
    ? // We need to prevent overflows in case Prefix and Suffix are already long
      // enough
      never
    : [...Prefix, ...Suffix]["length"] extends N
      ? never
      : [...Prefix, ...Suffix] | SubSampled<[...Prefix, Item], Item, Suffix, N>;

type IsLongerThan<T extends ReadonlyArray<unknown>, N extends number> =
  // Checking for `undefined` is a neat trick to avoid needing to compare
  // integer literals because if N overflows the tuple then the type for that
  // element will be `undefined`. This only works for fixed tuples!
  IsEqual<T[N], undefined> extends true ? false : true;

// Assuming T is a fixed tuple we build all it's possible sub-tuples.
type FixedSubTuples<T> = T extends readonly [infer Head, ...infer Rest]
  ? // For each element we either take it or skip it, and recurse over the rest.
    FixedSubTuples<Rest> | [Head, ...FixedSubTuples<Rest>]
  : [];

/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param data - The array.
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(array, sampleSize)
 * @example
 *    R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
 *    R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
 * @dataFirst
 * @category Array
 */
export function sample<const T extends IterableContainer, N extends number>(
  data: T,
  sampleSize: N,
): Sampled<T, N>;

/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(sampleSize)(array)
 * @example
 *    R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
 *    R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
 * @dataLast
 * @category Array
 */
export function sample<const T extends IterableContainer, N extends number>(
  sampleSize: N,
): (data: T) => Sampled<T, N>;

export function sample(...args: ReadonlyArray<unknown>): unknown {
  return purry(sampleImplementation, args);
}

function sampleImplementation<T>(
  data: ReadonlyArray<T>,
  sampleSize: number,
): Array<T> {
  if (sampleSize <= 0) {
    // Trivial
    return [];
  }

  if (sampleSize >= data.length) {
    // Trivial
    return [...data];
  }

  // We have 2 modes of sampling, depending on the size of the sample requested.
  // 1. If sampleSize is _small_, we generate indices that we then use to
  // *EXTRACT* individual elements from the array.
  // 2. If sampleSize is _large_, we instead generate indices to *EXCLUDE* from
  // a full scan of the input array (via filtering).
  //
  // This allows us 2 optimizations that are the core of how this function
  // works:
  // 1. It is hard to generate a large number of unique indices, as the more
  // indices we generate the more likely we are to generate one that is already
  // in the set, which would require more iterations of the generation loop.
  // Capping our effective sampleSize at n/2 would put an upper limit to the
  // average number of iterations required (as a function of n).
  // 2. If sample size is small enough, we never need to actually iterate over
  // the full input array at all; instead we simply project the values we need
  // via random access into the array. This means that for sampleSize (K) less
  // than n/2, we run at O(klogk). For large sampleSize we need to iterate over
  // the full input array, but we don't need to sort the indices because we can
  // use the Set's 'has' method, so we effectively run at O(n).
  const actualSampleSize = Math.min(sampleSize, data.length - sampleSize);

  const sampleIndices = new Set<number>();
  while (sampleIndices.size < actualSampleSize) {
    const randomIndex = Math.floor(Math.random() * data.length);
    sampleIndices.add(randomIndex);
  }

  if (sampleSize === actualSampleSize) {
    return [...sampleIndices]
      .sort((a, b) => a - b)
      .map((index) => data[index]!);
  }

  return data.filter((_, index) => !sampleIndices.has(index));
}
