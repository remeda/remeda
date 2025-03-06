import { memoizeIterator } from "./memoizeIterator";

/**
 * Given an iterable, returns an iterable that caches the values as they are
 * iterated over such that it can be iterated over multiple times, yielding the
 * same values each time.
 *
 * TODO: Move this out of internal?
 */
export function memoizeIterable<T>(data: Iterable<T>): Iterable<T> {
  return memoizeIterator(data[Symbol.iterator]());
}
