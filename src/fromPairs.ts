/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * @param tuples the list of input tuples
 * @signature
 *   R.fromPairs(tuples)
 * @example
 *   R.fromPairs([['a', 'b'], ['c', 'd']]) // => {a: 'b', c: 'd'}
 * @category Object
 */
export function fromPairs<K extends string | number | symbol, V>(tuples: Array<[K, V]>): Record<K, V>


export function fromPairs(tuples: Array<[string | number | symbol, unknown]>) {
  return tuples.reduce((acc, curr) => curr && curr.length === 2 ? ({
      ...acc,
      [curr[0]]: curr[1]
  }) : acc, {})
}
