import { purry } from "./purry";

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(data, predicate)
 * @example
 *    R.partition(
 *      ['one', 'two', 'forty two'],
 *      x => x.length === 3,
 *    ); // => [['one', 'two'], ['forty two']]
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
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(predicate)(data)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'forty two'],
 *      R.partition(x => x.length === 3),
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
export function partition<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];
export function partition<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function partition(...args: ReadonlyArray<unknown>): unknown {
  return purry(partitionImplementation, args);
}

const partitionImplementation = <T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): [Array<S>, Array<T>] => {
  const ret: [Array<S>, Array<T>] = [[], []];
  for (const [index, item] of data.entries()) {
    if (predicate(item, index, data)) {
      ret[0].push(item);
    } else {
      ret[1].push(item);
    }
  }
  return ret;
};
