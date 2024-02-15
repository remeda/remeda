import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import { PredIndexedOptional } from './_types';
import { purry } from './purry';

/**
 * A callback function receiving the first two parameters of a reduce operation.
 */
type Reducer<T, Accumulator> = (
  accumulator: Accumulator,
  currentValue: T
) => Accumulator;

/**
 * A callback function receiving the parameters of a reduce operation.
 */
type ReducerIndexed<T, Accumulator> = (
  accumulator: Accumulator,
  currentValue: T,
  index: number,
  items: Array<T>
) => Accumulator;

type ReducerIndexedOptional<T, Accumulator> = (
  accumulator: Accumulator,
  currentValue: T,
  index?: number,
  items?: Array<T>
) => Accumulator;

/**
 * Applies a reducer function on each element of the array, accumulating the results,
 * and returns an array of the successively reduced values.
 * @param array the array to map over
 * @param reducer the callback function
 * @param initialValue the initial value of the accumulator
 * @returns An array of successively reduced values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(items, fn, initialValue)
 *    R.mapWithFeedback.indexed(items, fn, initialValue)
 * @example
 *    R.mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => [101, 103, 106, 110, 115]
 *    R.mapWithFeedback.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100) // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function mapWithFeedback<T, Accumulator>(
  array: ReadonlyArray<T>,
  reducer: Reducer<T, Accumulator>,
  initialValue: Accumulator
): Array<Accumulator>;

/**
 * Applies a reducer function on each element of the array, accumulating the results,
 * and returns an array of the successively reduced values.
 * @param reducer the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @returns An array of successively reduced values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback((acc, x) => acc + x, 100)) // => [101, 103, 106, 110, 115]
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback.indexed((acc, x, i, array) => acc + x, 100)) // => [101, 103, 106, 110, 115]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function mapWithFeedback<T, Accumulator>(
  reducer: Reducer<T, Accumulator>,
  initialValue: Accumulator
): (items: ReadonlyArray<T>) => Array<Accumulator>;

export function mapWithFeedback() {
  return purry(
    mapWithFeedbackImplementation(false),
    arguments,
    mapWithFeedback.lazy
  );
}

const mapWithFeedbackImplementation =
  (indexed: boolean) =>
  <T, Accumulator>(
    items: Array<T>,
    reducer: ReducerIndexedOptional<T, Accumulator>,
    initialValue: Accumulator
  ) => {
    const implementation = indexed
      ? mapWithFeedback.lazyIndexed
      : mapWithFeedback.lazy;

    return _reduceLazy(items, implementation(reducer, initialValue), indexed);
  };

const lazyImplementation =
  (indexed: boolean) =>
  <T, Accumulator>(
    reducer: ReducerIndexedOptional<T, Accumulator>,
    initialValue: Accumulator
  ) => {
    let accumulator = initialValue;
    const modifiedReducer: PredIndexedOptional<T, Accumulator> = (
      currentValue,
      index,
      items
    ) => {
      accumulator = reducer(accumulator, currentValue, index, items);
      return accumulator;
    };

    return (
      value: T,
      index?: number,
      items?: Array<T>
    ): LazyResult<Accumulator> => ({
      done: false,
      hasNext: true,
      next: indexed
        ? modifiedReducer(value, index, items)
        : modifiedReducer(value),
    });
  };

export namespace mapWithFeedback {
  export function indexed<T, Accumulator>(
    items: ReadonlyArray<T>,
    reducer: ReducerIndexed<T, Accumulator>,
    initialValue: Accumulator
  ): Array<Accumulator>;
  export function indexed<T, Accumulator>(
    reducer: ReducerIndexed<T, Accumulator>,
    initialValue: Accumulator
  ): (items: ReadonlyArray<T>) => Array<Accumulator>;
  export function indexed() {
    return purry(
      mapWithFeedbackImplementation(true),
      arguments,
      mapWithFeedback.lazyIndexed
    );
  }

  export const lazy = lazyImplementation(false);
  export const lazyIndexed = _toLazyIndexed(lazyImplementation(true));
}
