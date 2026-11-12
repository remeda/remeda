import { SKIP_ITEM } from "./internal/lazyControl";
import { withLazyImplementation } from "./internal/lazyDataLastImplementation";
import { requireDataByArity } from "./internal/requireData";
import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(data, predicate)
 * @example
 *    dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  data: T,
  predicate: ArrayCallback<T, boolean>,
): T[number][];

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 10, 3, 4], dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  predicate: LazyCallback<T, boolean>,
): (data: T) => T[number][];

export function dropWhile(
  dataOrPredicate: IterableContainer | LazyCallback<IterableContainer, boolean>,
  predicate?: ArrayCallback<IterableContainer, boolean>,
): unknown {
  return typeof dataOrPredicate === "function"
    ? withLazyImplementation(
        dataLast(
          // @ts-expect-error [ts2345] -- Run eagerly, the data-last function hands the callback the complete input, a valid non-empty prefix whenever the callback is invoked (it never is for an empty input); TypeScript can't relate `T` to `NonEmptyPrefix<T>`.
          dataOrPredicate,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `lazyImplementation` invokes the callback only once the input has an item, so the prefix it passes is never empty; TypeScript can't tell from its `readonly T[]` type.
        dataOrPredicate,
      )
    : dropWhileImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof dropWhileImplementation> =
  (predicate) => (data) =>
    dropWhileImplementation(data, predicate);

function dropWhileImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): T[] {
  let index = 0;
  for (const item of data) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
    index += 1;
  }

  return [];
}

function lazyImplementation<T>(
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): LazyEvaluator<T> {
  let isDropping = true;
  return requireDataByArity(predicate, 2, (item, index, data) => {
    if (isDropping && predicate(item, index, data)) {
      return SKIP_ITEM;
    }

    isDropping = false;
    return item;
  });
}
