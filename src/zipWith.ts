type ZippingFunction<T1 = unknown, T2 = unknown, Value = unknown> = (
  first: T1,
  second: T2,
  index: number,
  data: readonly [first: ReadonlyArray<T1>, second: ReadonlyArray<T2>],
) => Value;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(first, second, fn)
 * @example
 *   R.zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @category Array
 */
export function zipWith<T1, T2, Value>(
  first: ReadonlyArray<T1>,
  second: ReadonlyArray<T2>,
  fn: ZippingFunction<T1, T2, Value>,
): Array<Value>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export function zipWith<T1, T2, Value>(
  fn: ZippingFunction<T1, T2, Value>,
): (first: ReadonlyArray<T1>, second: ReadonlyArray<T2>) => Array<Value>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @param second - The second input list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b, ['a', 'b', 'c'])(['1', '2', '3']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export function zipWith<T1, T2, Value>(
  fn: ZippingFunction<T1, T2, Value>,
  second: ReadonlyArray<T2>,
): (first: ReadonlyArray<T1>) => Array<Value>;

export function zipWith(
  arg0: ReadonlyArray<unknown> | ZippingFunction,
  arg1?: ReadonlyArray<unknown>,
  arg2?: ZippingFunction,
): unknown {
  if (typeof arg0 === "function") {
    // dataLast
    return arg1 === undefined
      ? (f: ReadonlyArray<unknown>, s: ReadonlyArray<unknown>) =>
          zipWithImplementation(f, s, arg0)
      : (f: ReadonlyArray<unknown>) => zipWithImplementation(f, arg1, arg0);
  }

  // dataFirst. Notice that we assert that the arguments are defined to reduce
  // the number of runtime checks that would otherwise be needed to make
  // TypeScript happy here. Because this is an internal implementation and we
  // are protected by the function typing itself this is fine!
  return zipWithImplementation(arg0, arg1!, arg2!);
}

function zipWithImplementation<T1, T2, Value>(
  first: ReadonlyArray<T1>,
  second: ReadonlyArray<T2>,
  fn: ZippingFunction<T1, T2, Value>,
): Array<Value> {
  const datum = [first, second] as const;

  const resultLength =
    first.length > second.length ? second.length : first.length;
  const result = [];
  for (let i = 0; i < resultLength; i++) {
    result.push(fn(first[i]!, second[i]!, i, datum));
  }

  return result;
}
