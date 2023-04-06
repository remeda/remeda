type Pair<Key extends PropertyKey, Value> = readonly [key: Key, value: Value];

/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 * @param tuples the list of input tuples
 * @signature
 *   R.fromPairs(tuples)
 * @example
 *   R.fromPairs([['a', 'b'], ['c', 'd']]) // => {a: 'b', c: 'd'}
 * @category Object
 */
export function fromPairs<V>(
  tuples: ReadonlyArray<Pair<number, V>>
): Record<number, V>;
export function fromPairs<V>(
  tuples: ReadonlyArray<Pair<string, V>>
): Record<string, V>;

export function fromPairs(
  tuples: ReadonlyArray<Pair<PropertyKey, unknown>>
): Record<string, unknown> {
  const out: Record<PropertyKey, unknown> = {};
  for (const [key, value] of tuples) {
    out[key] = value;
  }
  return out;
}
