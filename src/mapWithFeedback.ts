import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import { PredIndexedOptional } from './_types';
import { purry } from './purry';

/**
 * A callback function receiving the first two parameters of a reduce operation.
 */
type Reducer<TItem, TAccumulator> = (
  accumulator: TAccumulator,
  currentValue: TItem
) => TAccumulator;

/**
 * A callback function receiving the parameters of a reduce operation.
 */
type ReducerIndexed<TItem, TAccumulator> = (
  accumulator: TAccumulator,
  currentValue: TItem,
  index: number,
  items: Array<TItem>
) => TAccumulator;

type ReducerIndexedOptional<TItem, TAccumulator> = (
  accumulator: TAccumulator,
  currentValue: TItem,
  index?: number,
  items?: Array<TItem>
) => TAccumulator;

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
export function mapWithFeedback<TItem, TAccumulator>(
  array: ReadonlyArray<TItem>,
  reducer: Reducer<TItem, TAccumulator>,
  initialValue: TAccumulator
): Array<TAccumulator>;

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
export function mapWithFeedback<TItem, TAccumulator>(
  reducer: Reducer<TItem, TAccumulator>,
  initialValue: TAccumulator
): (items: ReadonlyArray<TItem>) => Array<TAccumulator>;

export function mapWithFeedback() {
  return purry(
    mapWithFeedbackImplementation(false),
    arguments,
    mapWithFeedback.lazy
  );
}

const mapWithFeedbackImplementation =
  (indexed: boolean) =>
  <TItem, TAccumulator>(
    items: Array<TItem>,
    reducer: ReducerIndexedOptional<TItem, TAccumulator>,
    initialValue: TAccumulator
  ) => {
    const implementation = indexed
      ? mapWithFeedback.lazyIndexed
      : mapWithFeedback.lazy;

    return _reduceLazy(items, implementation(reducer, initialValue), indexed);
  };

const lazyImplementation =
  (indexed: boolean) =>
  <TItem, TAccumulator>(
    reducer: ReducerIndexedOptional<TItem, TAccumulator>,
    initialValue: TAccumulator
  ) => {
    let accumulator = initialValue;
    const modifiedReducer: PredIndexedOptional<TItem, TAccumulator> = (
      currentValue,
      index,
      items
    ) => {
      accumulator = reducer(accumulator, currentValue, index, items);
      return accumulator;
    };

    return (
      value: TItem,
      index?: number,
      items?: Array<TItem>
    ): LazyResult<TAccumulator> => ({
      done: false,
      hasNext: true,
      next: indexed
        ? modifiedReducer(value, index, items)
        : modifiedReducer(value),
    });
  };

export namespace mapWithFeedback {
  export function indexed<TItem, TAccumulator>(
    items: ReadonlyArray<TItem>,
    reducer: ReducerIndexed<TItem, TAccumulator>,
    initialValue: TAccumulator
  ): Array<TAccumulator>;
  export function indexed<TItem, TAccumulator>(
    reducer: ReducerIndexed<TItem, TAccumulator>,
    initialValue: TAccumulator
  ): (items: ReadonlyArray<TItem>) => Array<TAccumulator>;
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
