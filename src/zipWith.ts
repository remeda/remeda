import { lazyDataLastImpl } from "./internal/lazyDataLastImpl";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

type ZippingFunction<
  T1 extends IterableContainer = IterableContainer,
  T2 extends IterableContainer = IterableContainer,
  Value = unknown,
> = (
  first: T1[number],
  second: T2[number],
  index: number,
  data: readonly [first: T1, second: T2],
) => Value;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a: string, b: string) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @category Array
 */
export function zipWith<TItem1, TItem2, Value>(
  fn: ZippingFunction<ReadonlyArray<TItem1>, ReadonlyArray<TItem2>, Value>,
): (
  first: ReadonlyArray<TItem1>,
  second: ReadonlyArray<TItem2>,
) => Array<Value>;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(second, fn)(first)
 * @example
 *   R.pipe(['1', '2', '3'], R.zipWith(['a', 'b', 'c'], (a, b) => a + b)) // => ['1a', '2b', '3c']
 * @dataLast
 * @lazy
 * @category Array
 */
export function zipWith<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
  Value,
>(second: T2, fn: ZippingFunction<T1, T2, Value>): (first: T1) => Array<Value>;

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
 * @lazy
 * @category Array
 */
export function zipWith<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
  Value,
>(first: T1, second: T2, fn: ZippingFunction<T1, T2, Value>): Array<Value>;

export function zipWith(
  arg0: IterableContainer | ZippingFunction,
  arg1?: IterableContainer | ZippingFunction,
  arg2?: ZippingFunction,
): unknown {
  if (typeof arg0 === "function") {
    // Both datum's last
    return (data1: IterableContainer, data2: IterableContainer) =>
      zipWithImplementation(data1, data2, arg0);
  }

  if (typeof arg1 === "function") {
    // dataLast
    return lazyDataLastImpl(
      zipWithImplementation,
      [arg0, arg1],
      lazyImplementation,
    );
  }

  // dataFirst. Notice that we assert that the arguments are defined to reduce
  // the number of runtime checks that would otherwise be needed to make
  // TypeScript happy here. Because this is an internal implementation and we
  // are protected by the function typing itself this is fine!
  return zipWithImplementation(arg0, arg1!, arg2!);
}

function zipWithImplementation<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
  Value,
>(first: T1, second: T2, fn: ZippingFunction<T1, T2, Value>): Array<Value> {
  const datum = [first, second] as const;
  return first.length < second.length
    ? first.map((item, index) => fn(item, second[index], index, datum))
    : second.map((item, index) => fn(first[index], item, index, datum));
}

const lazyImplementation =
  <T1, T2 extends IterableContainer, Value>(
    second: T2,
    fn: ZippingFunction<ReadonlyArray<T1>, T2, Value>,
  ): LazyEvaluator<T1, Value> =>
  (value, index, data) => ({
    next: fn(value, second[index], index, [data, second]),
    hasNext: true,
    done: index >= second.length - 1,
  });
