import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import type { IterableContainer, Mapped } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Applies a function on each element of the array, using the result of the previous application, and returns an array of the successively computed values.
 *
 * @param array - The array to map over.
 * @param reducer - The callback function that receives the previous value, the current element, and optionally the index and the whole array.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(items, fn, initialValue)
 *    R.mapWithFeedback.indexed(items, fn, initialValue)
 * @example
 *    R.mapWithFeedback([1, 2, 3, 4, 5], (prev, x) => prev + x, 100) // => [101, 103, 106, 110, 115]
 *    R.mapWithFeedback.indexed([1, 2, 3, 4, 5], (prev, x, i, array) => prev + x, 100) // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function mapWithFeedback<T extends IterableContainer, U>(
  array: T,
  reducer: (previousValue: U, currentValue: T[number]) => U,
  initialValue: U,
): Mapped<T, U>;

/**
 * Applies a function on each element of the array, using the result of the previous application, and returns an array of the successively computed values.
 *
 * @param reducer - The callback function that receives the previous value, the current element, and optionally the index and the whole array.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback((prev, x) => prev + x, 100)) // => [101, 103, 106, 110, 115]
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback.indexed((prev, x, i, array) => prev + x, 100)) // => [101, 103, 106, 110, 115]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function mapWithFeedback<T extends IterableContainer, U>(
  reducer: (previousValue: U, currentValue: T[number]) => U,
  initialValue: U,
): (items: T) => Mapped<T, U>;

export function mapWithFeedback(): unknown {
  return purry(
    mapWithFeedbackImplementation(false),
    arguments,
    mapWithFeedback.lazy,
  );
}

const mapWithFeedbackImplementation =
  (indexed: boolean) =>
  <T, U>(
    items: ReadonlyArray<T>,
    reducer: (
      previousValue: U,
      currentValue: T,
      index?: number,
      items?: ReadonlyArray<T>,
    ) => U,
    initialValue: U,
  ) => {
    const implementation = indexed
      ? mapWithFeedback.lazyIndexed
      : mapWithFeedback.lazy;

    return _reduceLazy(items, implementation(reducer, initialValue), indexed);
  };

const lazyImplementation =
  (indexed: boolean) =>
  <T, U>(
    reducer: (
      previousValue: U,
      currentValue: T,
      index?: number,
      items?: ReadonlyArray<T>,
    ) => U,
    initialValue: U,
  ): LazyEvaluator<T, U> => {
    let previousValue = initialValue;
    return (value, index, items) => {
      previousValue = indexed
        ? reducer(previousValue, value, index, items)
        : reducer(previousValue, value);
      return {
        done: false,
        hasNext: true,
        next: previousValue,
      };
    };
  };

export namespace mapWithFeedback {
  export function indexed<T extends IterableContainer, U>(
    items: T,
    reducer: (
      previousValue: U,
      currentValue: T[number],
      index: number,
      items: T,
    ) => U,
    initialValue: U,
  ): Mapped<T, U>;
  export function indexed<T extends IterableContainer, U>(
    reducer: (
      previousValue: U,
      currentValue: T[number],
      index: number,
      items: T,
    ) => U,
    initialValue: U,
  ): (items: T) => Mapped<T, U>;
  export function indexed(): unknown {
    return purry(
      mapWithFeedbackImplementation(true),
      arguments,
      mapWithFeedback.lazyIndexed,
    );
  }

  export const lazy = lazyImplementation(false);
  export const lazyIndexed = _toLazyIndexed(lazyImplementation(true));
}
