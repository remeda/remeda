import type { ArrayCallback } from "./internal/types/Callback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(data, predicate)
 * @example
 *    splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T extends IterableContainer>(
  data: T,
  predicate: ArrayCallback<T, boolean>,
): [T[number][], T[number][]];

/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(predicate)(data)
 * @example
 *    splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T extends IterableContainer>(
  predicate: ArrayCallback<T, boolean>,
): (data: T) => [T[number][], T[number][]];

export function splitWhen(
  dataOrPredicate:
    IterableContainer | ArrayCallback<IterableContainer, boolean>,
  predicate?: ArrayCallback<IterableContainer, boolean>,
): unknown {
  return typeof dataOrPredicate === "function"
    ? dataLast(dataOrPredicate)
    : splitWhenImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof splitWhenImplementation> =
  (predicate) => (data) =>
    splitWhenImplementation(data, predicate);

function splitWhenImplementation<T>(
  data: readonly T[],
  predicate: (item: T, index: number, data: readonly T[]) => boolean,
): [T[], T[]] {
  const index = data.findIndex(predicate);
  return index === -1
    ? [data.concat(), []]
    : [data.slice(0, index), data.slice(index)];
}
