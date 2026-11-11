import { withLazyImplementation } from "./internal/lazyDataLastImplementation";
import {
  makeStoppable,
  STOP,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { requireDataByArity } from "./internal/requireData";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type {
  LazyCallback,
  LazyTypePredicate,
} from "./internal/types/LazyCallback";
import type { NarrowedArray } from "./internal/types/NarrowedArray";
import type { NonRefinedFilteredArray } from "./internal/types/NonRefinedFilteredArray";

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(data, predicate)
 * @example
 *    takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): NarrowedArray<T, Condition>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  predicate: LazyTypePredicate<T, Condition>,
): (data: T) => NarrowedArray<T, Condition>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: LazyCallback<T, IsItemIncluded>,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function takeWhile(
  dataOrPredicate: unknown,
  predicate?: unknown,
): unknown {
  return typeof dataOrPredicate === "function"
    ? withLazyImplementation(
        dataLast(
          // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
          dataOrPredicate,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrPredicate,
      )
    : takeWhileImplementation(
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrPredicate,
        predicate,
      );
}

const dataLast =
  (predicate: Parameters<typeof takeWhileImplementation>[1]) =>
  (data: Parameters<typeof takeWhileImplementation>[0]) =>
    takeWhileImplementation(data, predicate);

function takeWhileImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): T[] {
  const ret: T[] = [];
  let index = 0;
  for (const item of data) {
    if (!predicate(item, index, data)) {
      break;
    }
    ret.push(item);
    index += 1;
  }
  return ret;
}

const lazyImplementation = makeStoppable(
  <T>(
    predicate: (item: T, index: number, data: readonly T[]) => boolean,
  ): StoppableLazyEvaluator<T> =>
    requireDataByArity(predicate, 2, (item, index, data) =>
      predicate(item, index, data) ? item : STOP,
    ),
);
