import { purryWithLazy } from "./internal/purryWithLazy";
import { requireDataByArity } from "./internal/requireData";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { Mapped } from "./internal/types/Mapped";
import type { NonEmptyPrefix } from "./internal/types/NonEmptyPrefix";

type FeedbackCallback<T extends IterableContainer, U, Data = T> = (
  previousValue: U,
  currentValue: T[number],
  currentIndex: number,
  data: Readonly<Data>,
) => U;

/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param data - The array to map over.
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    mapWithFeedback(data, callbackfn, initialValue);
 * @example
 *    mapWithFeedback(
 *      [1, 2, 3, 4, 5],
 *      (prev, x) => prev + x,
 *      100,
 *    ); // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function mapWithFeedback<T extends IterableContainer, U>(
  data: T,
  callbackfn: FeedbackCallback<T, U>,
  initialValue: U,
): Mapped<T, U>;

/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    mapWithFeedback(callbackfn, initialValue)(data);
 * @example
 *    pipe(
 *      [1, 2, 3, 4, 5],
 *      mapWithFeedback((prev, x) => prev + x, 100),
 *    ); // => [101, 103, 106, 110, 115]
 * @dataLast
 * @lazy
 * @category Array
 */
export function mapWithFeedback<T extends IterableContainer, U>(
  callbackfn: FeedbackCallback<T, U, NonEmptyPrefix<T>>,
  initialValue: U,
): (data: T) => Mapped<T, U>;

export function mapWithFeedback(...args: readonly unknown[]): unknown {
  return purryWithLazy(mapWithFeedbackImplementation, args, lazyImplementation);
}

function mapWithFeedbackImplementation<T, U>(
  data: readonly T[],
  callbackfn: FeedbackCallback<readonly T[], U>,
  initialValue: U,
): U[] {
  let previousValue = initialValue;

  const result: U[] = [];
  for (const currentValue of data) {
    previousValue = callbackfn(
      previousValue,
      currentValue,
      result.length,
      data,
    );
    result.push(previousValue);
  }

  return result;
}

function lazyImplementation<T, U>(
  callbackfn: FeedbackCallback<readonly T[], U>,
  initialValue: U,
): LazyEvaluator<T, U> {
  let previousValue = initialValue;

  return requireDataByArity(
    callbackfn,
    (currentValue, index, data) => {
      previousValue = callbackfn(previousValue, currentValue, index, data);
      return previousValue;
    },
    { dataParameterIndex: 3 },
  );
}
