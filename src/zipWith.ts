type ZippingFunction<F = unknown, S = unknown, R = unknown> = (f: F, s: S) => R;

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
 * @dataFirst
 * @category Array
 */
export function zipWith<F, S, R>(
  first: ReadonlyArray<F>,
  second: ReadonlyArray<S>,
  fn: ZippingFunction<F, S, R>,
): Array<R>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 * @param fn the function applied to each position of the list
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export function zipWith<F, S, R>(
  fn: ZippingFunction<F, S, R>,
): (first: ReadonlyArray<F>, second: ReadonlyArray<S>) => Array<R>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 * @param fn the function applied to each position of the list
 * @param second the second input list
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b, ['a', 'b', 'c'])(['1', '2', '3']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export function zipWith<F, S, R>(
  fn: ZippingFunction<F, S, R>,
  second: ReadonlyArray<S>,
): (first: ReadonlyArray<F>) => Array<R>;

export function zipWith(
  arg0: ZippingFunction | ReadonlyArray<unknown>,
  arg1?: ReadonlyArray<unknown>,
  arg2?: ZippingFunction,
): unknown {
  if (typeof arg0 === "function") {
    return arg1 === undefined
      ? (f: ReadonlyArray<unknown>, s: ReadonlyArray<unknown>) =>
          _zipWith(f, s, arg0)
      : (f: ReadonlyArray<unknown>) => _zipWith(f, arg1, arg0);
  }

  if (arg1 === undefined || arg2 === undefined) {
    throw new Error("zipWith: Missing arguments in dataFirst function call");
  }

  return _zipWith(arg0, arg1, arg2);
}

function _zipWith<F, S, R>(
  first: ReadonlyArray<F>,
  second: ReadonlyArray<S>,
  fn: ZippingFunction<F, S, R>,
) {
  const resultLength =
    first.length > second.length ? second.length : first.length;
  const result = [];
  for (let i = 0; i < resultLength; i++) {
    result.push(fn(first[i]!, second[i]!));
  }

  return result;
}
