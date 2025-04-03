import type { IterableContainer } from "./internal/types/IterableContainer";
import doTransduce from "./internal/doTransduce";

type IterableZippingFunction<T1 = unknown, T2 = unknown, Value = unknown> = (
  first: T1,
  second: T2,
  index: number,
  data: readonly [ReadonlyArray<T1>, ReadonlyArray<T2>],
) => Value;

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
 * @lazy
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

export function zipWith(...args: ReadonlyArray<unknown>): unknown {
  // Both iterables last.
  if (typeof args[0] === "function") {
    return (data1: Iterable<unknown>, data2: Iterable<unknown>) =>
      doTransduce(
        zipWithImplementation,
        lazyImplementation,
        [data1, data2, args[0]],
        true,
      );
  }

  if (typeof args[1] === "function") {
    return doTransduce(
      zipWithImplementation,
      lazyImplementation,
      [args[0], args[1]],
      false,
    );
  }

  return doTransduce(zipWithImplementation, lazyImplementation, args, true);
}

function zipWithImplementation<T1, T2, Value>(
  first: ReadonlyArray<T1>,
  second: ReadonlyArray<T2>,
  fn: IterableZippingFunction<T1, T2, Value>,
): Array<Value> {
  const datum = [first, second] as const;
  if (first.length < second.length) {
    return first.map((item, index) => fn(item, second[index]!, index, datum));
  }
  return second.map((item, index) => fn(first[index]!, item, index, datum));
}

function* lazyImplementation<T1, T2, Value>(
  first: Iterable<T1>,
  second: Iterable<T2>,
  fn: IterableZippingFunction<T1, T2, Value>,
): Iterable<Value> {
  const iter = second[Symbol.iterator]();
  const data1: Array<T1> = [];
  const data2: Array<T2> = [];
  for (const firstValue of first) {
    const next = iter.next();
    if (next.done === true) {
      return;
    }
    yield fn(firstValue, next.value, data1.length - 1, [data1, data2]);
  }
}
