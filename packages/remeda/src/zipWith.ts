import { lazyDataLastImplementation2 } from "./internal/lazyDataLastImplementation";
import {
  lastLazyValue,
  LAZY_EMPTY_EVALUATOR,
  makeStoppable,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { requireDataByArity } from "./internal/requireData";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NonEmptyPrefix } from "./internal/types/NonEmptyPrefix";

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

// Inside `pipe` the first list flows through lazily, so the callback only sees
// the items processed so far, while the second list is provided upfront and is
// always complete.
type LazyZippingFunction<
  T1 extends IterableContainer = IterableContainer,
  T2 extends IterableContainer = IterableContainer,
  Value = unknown,
> = (
  first: T1[number],
  second: T2[number],
  index: number,
  data: readonly [first: Readonly<NonEmptyPrefix<T1>>, second: T2],
) => Value;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(fn)(first, second)
 * @example
 *   zipWith((a: string, b: string) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @category Array
 */
export function zipWith<TItem1, TItem2, Value>(
  fn: ZippingFunction<readonly TItem1[], readonly TItem2[], Value>,
): (data: readonly TItem1[], other: readonly TItem2[]) => Value[];

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param other - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(second, fn)(first)
 * @example
 *   pipe(['1', '2', '3'], zipWith(['a', 'b', 'c'], (a, b) => a + b)) // => ['1a', '2b', '3c']
 * @dataLast
 * @lazy
 * @category Array
 */
export function zipWith<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
  Value,
>(other: T2, fn: LazyZippingFunction<T1, T2, Value>): (data: T1) => Value[];

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param data - The first input list.
 * @param other - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(first, second, fn)
 * @example
 *   zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @lazy
 * @category Array
 */
export function zipWith<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
  Value,
>(data: T1, other: T2, fn: ZippingFunction<T1, T2, Value>): Value[];

// TODO [>2]: Consider removing this function. `map(zip(data, other), ([first, second]) => fn(first, second))`, or `pipe(data, zip(other), map(...))` inside a `pipe`, covers it and also keeps tuple shapes in the output type. All it adds is passing a binary callback without destructuring and skipping the pair allocated per item.
export function zipWith(
  arg0: IterableContainer | ZippingFunction,
  arg1?: IterableContainer | LazyZippingFunction | ZippingFunction,
  arg2?: ZippingFunction,
): unknown {
  if (typeof arg0 === "function") {
    // Both datum's last
    return (data1: IterableContainer, data2: IterableContainer) =>
      zipWithImplementation(data1, data2, arg0);
  }

  if (typeof arg1 === "function") {
    // dataLast
    return lazyDataLastImplementation2(
      zipWithImplementation,
      lazyImplementation,
      arg0,
      // @ts-expect-error [ts2345] -- Outside a pipe the data-last function hands the implementation the full first list, which is a valid non-empty prefix whenever `fn` is invoked (it never is for an empty list); TypeScript can't relate `T1` to `NonEmptyPrefix<T1>`.
      arg1,
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
>(data: T1, other: T2, fn: ZippingFunction<T1, T2, Value>): Value[] {
  const datum = [data, other] as const;
  return data.length < other.length
    ? data.map((item, index) => fn(item, other[index], index, datum))
    : other.map((item, index) => fn(data[index], item, index, datum));
}

const lazyImplementation = makeStoppable(
  <T1, T2 extends IterableContainer, Value>([other, fn]: readonly [
    second: T2,
    fn: ZippingFunction<readonly T1[], T2, Value>,
  ]): StoppableLazyEvaluator<T1, Value> =>
    other.length === 0
      ? LAZY_EMPTY_EVALUATOR
      : requireDataByArity(fn, 3, (value, index, data, slot) => {
          const zipped = fn(value, other[index], index, [data, other]);
          return index >= other.length - 1
            ? lastLazyValue(zipped, slot)
            : zipped;
        }),
);
