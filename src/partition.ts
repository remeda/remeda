import { purry } from "./purry";

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A type guard function to invoke on every item.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(array, fn)
 * @example
 *    R.partition(['one', 'two', 'forty two'], x => x.length === 3) // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @category Array
 */
export function partition<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): [Array<S>, Array<Exclude<T, S>>];
export function partition<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - The grouping function.
 * @returns The array of grouped elements.
 * @signature
 *    R.partition(fn)(array)
 * @example
 *    R.pipe(['one', 'two', 'forty two'], R.partition(x => x.length === 3)) // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
export function partition<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];
export function partition<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function partition(): unknown {
  return purry(partitionImplementation, arguments);
}

const partitionImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] => {
  const ret: [Array<T>, Array<T>] = [[], []];
  for (let index = 0; index < data.length; index++) {
    // TODO: Once we bump our Typescript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value.
    const item = data[index]!;
    const matches = predicate(item, index, data);
    ret[matches ? 0 : 1].push(item);
  }
  return ret;
};
