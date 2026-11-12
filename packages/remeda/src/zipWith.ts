import { withLazyImplementation } from "./internal/lazyDataLastImplementation";
import {
  lastLazyValue,
  LAZY_EMPTY_EVALUATOR,
  makeStoppable,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { requireDataByArity } from "./internal/requireData";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NonEmptyPrefix } from "./internal/types/NonEmptyPrefix";

type ZippingFunction<
  T extends IterableContainer = IterableContainer,
  S extends IterableContainer = IterableContainer,
  Value = unknown,
> = (
  first: T[number],
  second: S[number],
  index: number,
  data: readonly [first: T, second: S],
) => Value;

// Inside `pipe` the first list flows through lazily, so the callback only sees
// the items processed so far, while the second list is provided upfront and is
// always complete.
type LazyZippingFunction<
  T extends IterableContainer = IterableContainer,
  S extends IterableContainer = IterableContainer,
  Value = unknown,
> = (
  first: T[number],
  second: S[number],
  index: number,
  data: readonly [first: Readonly<NonEmptyPrefix<T>>, second: S],
) => Value;

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(fn)(data, other)
 * @example
 *   zipWith((a: string, b: string) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @category Array
 */
export function zipWith<T, S, Value>(
  fn: ZippingFunction<readonly T[], readonly S[], Value>,
): (data: readonly T[], other: readonly S[]) => Value[];

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param other - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(other, fn)(data)
 * @example
 *   pipe(['1', '2', '3'], zipWith(['a', 'b', 'c'], (a, b) => a + b)) // => ['1a', '2b', '3c']
 * @dataLast
 * @lazy
 * @category Array
 */
export function zipWith<
  T extends IterableContainer,
  S extends IterableContainer,
  Value,
>(other: S, fn: LazyZippingFunction<T, S, Value>): (data: T) => Value[];

/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param data - The first input list.
 * @param other - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   zipWith(data, other, fn)
 * @example
 *   zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @lazy
 * @category Array
 */
export function zipWith<
  T extends IterableContainer,
  S extends IterableContainer,
  Value,
>(data: T, other: S, fn: ZippingFunction<T, S, Value>): Value[];

// TODO [>2]: Consider removing this function. `map(zip(data, other), ([first, second], index) => fn(first, second, index, [data, other]))`, or `zip(other)` then `map(...)` inside a `pipe`, covers it and also keeps tuple shapes in the output type, and an arrow function over `zip` covers the `zipWith(fn)` form. All it adds is a callback that takes the pair unpacked, with no pair allocated per item.
export function zipWith(
  dataOtherOrFn: IterableContainer | ZippingFunction,
  otherOrFn?: IterableContainer | LazyZippingFunction | ZippingFunction,
  fn?: ZippingFunction,
): unknown {
  if (typeof dataOtherOrFn === "function") {
    // Both datum's last
    return (data1: IterableContainer, data2: IterableContainer) =>
      zipWithImplementation(data1, data2, dataOtherOrFn);
  }

  if (typeof otherOrFn === "function") {
    // dataLast
    return withLazyImplementation(
      dataLast(
        dataOtherOrFn,
        // @ts-expect-error [ts2345] -- Outside a pipe the data-last function hands the implementation the full first list, which is a valid non-empty prefix whenever `fn` is invoked (it never is for an empty list); TypeScript can't relate `T1` to `NonEmptyPrefix<T1>`.
        otherOrFn,
      ),
      lazyImplementation,
      [
        dataOtherOrFn,
        // @ts-expect-error [ts2322] -- `lazyImplementation` calls `fn` only once the first list has an item, so the prefix it passes is never empty; TypeScript can't tell from its `readonly T1[]` type.
        otherOrFn,
      ],
    );
  }

  // dataFirst. Notice that we assert that the arguments are defined to reduce
  // the number of runtime checks that would otherwise be needed to make
  // TypeScript happy here. Because this is an internal implementation and we
  // are protected by the function typing itself this is fine!
  return zipWithImplementation(dataOtherOrFn, otherOrFn!, fn!);
}

const dataLast: DataLastBuilder<typeof zipWithImplementation> =
  (other, fn) => (data) =>
    zipWithImplementation(data, other, fn);

function zipWithImplementation<
  T extends IterableContainer,
  S extends IterableContainer,
  Value,
>(data: T, other: S, fn: ZippingFunction<T, S, Value>): Value[] {
  const datum = [data, other] as const;
  return data.length < other.length
    ? data.map((item, index) => fn(item, other[index], index, datum))
    : other.map((item, index) => fn(data[index], item, index, datum));
}

const lazyImplementation = makeStoppable(
  <T1, T2 extends IterableContainer, Value>([other, fn]: readonly [
    other: T2,
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
