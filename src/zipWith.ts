/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 * @param first the first input list
 * @param second the second input list
 * @param fn the function applied to each position of the list
 * @signature
 *   R.zipWith(first, second, fn)
 * @example
 *   R.zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @data_first
 * @category Array
 */
export function zipWith<F, S, R>(
  first: Array<F>,
  second: Array<S>,
  fn: (f: F, s: S) => R
): Array<R>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 * @param fn the function applied to each position of the list
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @data_last
 * @category Array
 */
export function zipWith<F, S, R>(
  fn: (f: F, s: S) => R
): (first: Array<F>, second: Array<S>) => Array<R>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 * @param fn the function applied to each position of the list
 * @param second the second input list
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b, ['a', 'b', 'c'])(['1', '2', '3']) // => ['1a', '2b', '3c']
 * @data_last
 * @category Array
 */
export function zipWith<F, S, R>(
  fn: (f: F, s: S) => R,
  second: Array<S>
): (first: Array<F>) => Array<R>;

export function zipWith() {
  const args = Array.from(arguments);
  if (typeof args[0] === 'function' && args.length === 1) {
    return function (f: any, s: any) {
      return _zipWith(f, s, args[0]);
    };
  }

  if (typeof args[0] === 'function' && args.length === 2) {
    return function (f: any) {
      return _zipWith(f, args[1], args[0]);
    };
  }

  if (args.length === 3) {
    return _zipWith(args[0], args[1], args[2]);
  }
}

function _zipWith<F, S, R>(
  first: Array<F>,
  second: Array<S>,
  fn: (f: F, s: S) => R
) {
  const resultLength =
    first.length > second.length ? second.length : first.length;
  const result = [];
  for (let i = 0; i < resultLength; i++) {
    result.push(fn(first[i], second[i]));
  }

  return result;
}
