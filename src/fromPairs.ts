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
export function fromPairs<V>(tuples: ReadonlyArray<[number, V]>): Record<number, V>;
export function fromPairs<V>(tuples: ReadonlyArray<[string, V]>): Record<string, V>;

export function fromPairs(tuples: ReadonlyArray<[string | number, unknown]>) {
  return tuples.reduce<Record<string | number, unknown>>((acc, curr) => {
    if (curr && curr.length === 2) {
      acc[curr[0]] = curr[1];
    }
    return acc;
  }, {});
}
