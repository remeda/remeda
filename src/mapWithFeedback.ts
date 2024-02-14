import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';

import { purry } from './purry';

/**
 * Similar to reduce, but returns an array of successively reduced values from the left side of the array.
 * @param array the array to map over
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *    R.mapWithFeedback(items, fn, initialValue)
 *    R.mapWithFeedback.indexed(items, fn, initialValue)
 * @example
 *    R.mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => [101, 103, 106, 110, 115]
 *    R.mapWithFeedback.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100) // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @indexed
 * @category Array
 */
export function mapWithFeedback<T, K>(
  items: ReadonlyArray<T>,
  fn: (acc: K, item: T) => K,
  initialValue: K
): Array<K>;

/**
 * Similar to reduce, but returns an array of successively reduced values from the left side of the array.
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
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
export function mapWithFeedback<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: ReadonlyArray<T>) => Array<K>;

export function mapWithFeedback() {
  return purry(_mapWithFeedback(false), arguments, mapWithFeedback.lazy);
}

const _mapWithFeedback =
  (indexed: boolean) =>
  <T, K>(
    items: Array<T>,
    reducer: (
      accumulator: K,
      currentValue: T,
      index?: number,
      items?: Array<T>
    ) => K,
    initialValue: K
  ) => {
    const createImplementation = indexed
      ? mapWithFeedback.lazyIndexed
      : mapWithFeedback.lazy;

    return _reduceLazy(
      items,
      createImplementation(reducer, initialValue),
      indexed
    );
  };

const _lazyIndexed = <T, K>(
  reducer: (
    accumulator: K,
    currentValue: T,
    index?: number,
    items?: Array<T>
  ) => K,
  initialValue: K
) => {
  let accumulator = initialValue;
  const curriedReducer = (
    currentValue: T,
    index?: number,
    items?: Array<T>
  ): K => {
    accumulator = reducer(accumulator, currentValue, index, items);
    return accumulator;
  };

  return (value: T, index?: number, items?: Array<T>): LazyResult<K> => {
    return {
      done: false,
      hasNext: true,
      next: curriedReducer(value, index, items),
    };
  };
};

export namespace mapWithFeedback {
  export function indexed<T, K>(
    items: ReadonlyArray<T>,
    fn: (acc: K, item: T, index: number, items: Array<T>) => K,
    initialValue: K
  ): Array<K>;
  export function indexed<T, K>(
    fn: (acc: K, item: T, index: number, items: Array<T>) => K,
    initialValue: K
  ): (items: ReadonlyArray<T>) => Array<K>;
  export function indexed() {
    return purry(
      _mapWithFeedback(true),
      arguments,
      mapWithFeedback.lazyIndexed
    );
  }

  export function lazy<T, K>(
    reducer: (
      accumulator: K,
      currentValue: T,
      index?: number,
      items?: Array<T>
    ) => K,
    initialValue: K
  ) {
    let accumulator = initialValue;
    const curriedReducer = (currentValue: T): K => {
      accumulator = reducer(accumulator, currentValue);
      return accumulator;
    };

    return (value: T): LazyResult<K> => {
      return {
        done: false,
        hasNext: true,
        next: curriedReducer(value),
      };
    };
  }
  export const lazyIndexed = _toLazyIndexed(_lazyIndexed);
}
