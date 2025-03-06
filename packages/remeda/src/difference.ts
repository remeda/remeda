import doTransduce from "./internal/doTransduce";

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(data, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    R.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(data: Iterable<T>, other: Iterable<T>): Array<T>;

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(data)
 * @example
 *    R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
 *    R.pipe([1, 1, 2, 2], R.difference([1])); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(
  other: Iterable<T>,
): (data: Iterable<T>) => Array<T>;

export function difference(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  other: Iterable<T>,
): Iterable<T> {
  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  for (const value of data) {
    const copies = remaining.get(value);

    if (copies === undefined || copies === 0) {
      // The item is either not part of the other array or we've dropped enough
      // copies of it so we return it.
      yield value;
    } else {
      // The item is equal to an item in the other array and there are still
      // copies of it to "account" for so we skip this one and remove it from our
      // ongoing tally.
      remaining.set(value, copies - 1);
    }
  }
}
