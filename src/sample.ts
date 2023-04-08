import { IterableContainer, NonEmptyArray } from './_types';
import { purry } from './purry';

type Out<T extends IterableContainer> = T['length'] extends 0
  ? []
  : NonEmptyArray<T>;

export function sample<T extends IterableContainer>(data: T, sampleSize: 0): [];
export function sample<T extends IterableContainer>(
  data: T,
  sampleSize: number
): Out<T>;
export function sample<T extends IterableContainer>(
  sampleSize: 0
): (data: T) => [];
export function sample<T extends IterableContainer>(
  sampleSize: number
): (data: T) => Out<T>;

export function sample(...args: ReadonlyArray<unknown>): unknown {
  return purry(sampleImplementation, args);
}

function sampleImplementation<T>(data: Array<T>, sampleSize: number): Array<T> {
  if (sampleSize < 0) {
    throw new Error(`sampleSize must cannot be negative: ${sampleSize}`);
  }

  if (!Number.isInteger(sampleSize)) {
    throw new Error(`sampleSize must be an integer: ${sampleSize}`);
  }

  if (sampleSize === 0) {
    // Trivial
    return [];
  }

  if (sampleSize >= data.length) {
    // Trivial
    return data;
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
    return Array.from(sampleIndices)
      .sort((a, b) => a - b)
      .map(index => data[index]);
  }

  return data.filter((_, index) => !sampleIndices.has(index));
}
