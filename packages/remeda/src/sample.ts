import type {
  FixedLengthArray,
  IsEqual,
  IsNever,
  NonNegativeInteger,
  Writable,
} from "type-fest";
import type { CoercedArray } from "./internal/types/CoercedArray";
import type { If } from "./internal/types/If";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { PartialArray } from "./internal/types/PartialArray";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

/**
 * When N is primitive we don't have a lot of information to base the output on,
 * but we can say it will be any possible subset shape of the input.
 */
type SampledPrimitive<T extends IterableContainer> = [
  ...FixedSubTuples<TupleParts<T>["required"]>,
  // TODO: We currently have no tests that check optional elements!
  ...PartialArray<FixedSubTuples<TupleParts<T>["optional"]>>,
  ...CoercedArray<TupleParts<T>["item"]>,
  ...FixedSubTuples<TupleParts<T>["suffix"]>,
];

type SampledLiteral<T extends IterableContainer, N extends number> = If<
  // When N is trivially 0 the result is trivially empty.
  IsEqual<N, 0>,
  [],
  If<
    IsNever<TupleParts<T>["item"]>,
    If<
      // When T is a fixed tuple and N is literal (e.g., `[1, 2, 3]` and `10`)
      // we can skip reconstructing the output and simply return a writable
      // version of the input. Checking for `undefined` is a neat trick to
      // avoid needing to compare integer literals because if N overflows the
      // tuple then the type for that element will be `undefined`.
      IsEqual<T[N], undefined>,
      Writable<T>,
      // When the input is a fixed tuple the result is simply all sub-tuples of
      // it that are exactly N elements long. Extract allows us to do this by
      // effectively intersecting each union element with a "template" tuple
      // that extends all tuples of length N.
      Extract<
        // TODO: This deliberately ignores optional elements which we don't have tests for either. In order to handle optional elements we can treat the "optional" tuple-part as more required elements.
        FixedSubTuples<TupleParts<T>["required"]>,
        // This is just [unknown, unknown, ..., unknown] with N elements.
        FixedLengthArray<unknown, N>
      >
    >,
    SampledWithRest<T, N>
  >
>;

// Assuming T is a fixed tuple we build all it's possible sub-tuples.
type FixedSubTuples<T> = T extends readonly [infer Head, ...infer Rest]
  ? // For each element we either take it or skip it, and recurse over the rest.
    FixedSubTuples<Rest> | [Head, ...FixedSubTuples<Rest>]
  : [];

type SampledWithRest<
  T extends IterableContainer,
  N extends number,
  Iteration extends Array<unknown> = [],
> =
  // Stop the recursion when the Iteration "array" is full
  Iteration["length"] extends N
    ? []
    : // If the tuple has a defined (non-rest) element, cut it and add it to the
      // output tuple.
      T extends readonly [infer First, ...infer Tail]
      ? [
          First | Tail[number],
          ...SampledWithRest<Tail, N, [unknown, ...Iteration]>,
        ]
      : T extends readonly [...infer Head, infer Last]
        ? [...SampledWithRest<Head, N, [unknown, ...Iteration]>, Last]
        : // If the input is an array, or a tuple's rest-element we need to
          // split the recursion in 2, one type adds an element to the output,
          // and the other skips it, just like the sample method itself.
          | SampledWithRest<T, N, [unknown, ...Iteration]>
            | [T[number], ...SampledWithRest<T, N, [unknown, ...Iteration]>];

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
  sampleSize: NonNegativeInteger<N>,
): SampledLiteral<T, N>;
export function sample<const T extends IterableContainer>(
  data: T,
  sampleSize: number,
): SampledPrimitive<T>;

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
  sampleSize: NonNegativeInteger<N>,
): (data: T) => SampledLiteral<T, N>;
export function sample<const T extends IterableContainer>(
  sampleSize: number,
): (data: T) => SampledPrimitive<T>;

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
