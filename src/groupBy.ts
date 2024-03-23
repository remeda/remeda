import type { ExactRecord, NonEmptyArray } from "./_types";
import { purry } from "./purry";

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * @param data - The items to group.
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupBy(data, callbackfn)
 * @example
 *    R.groupBy([{a: 'cat'}, {a: 'dog'}] as const, R.prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupBy(callbackfn)(data);
 * @example
 *    R.pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      R.groupBy(R.prop('a')),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.pipe(
 *      [0, 1],
 *      R.groupBy(x => x % 2 === 0 ? 'even' : undefined),
 *    ); // => {even: [0]}
 * @dataLast
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): (items: ReadonlyArray<T>) => ExactRecord<Key, NonEmptyArray<T>>;

export function groupBy(): unknown {
  return purry(groupByImplementation, arguments);
}

const groupByImplementation = <T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>> => {
  const output: Partial<Record<Key, Array<T>>> = {};

  for (let index = 0; index < data.length; index++) {
    // TODO: Once we bump our Typescript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value.
    const item = data[index]!;
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      let { [key]: items } = output;
      if (items === undefined) {
        items = [];
        output[key] = items;
      }
      items.push(item);
    }
  }

  return output as ExactRecord<Key, NonEmptyArray<T>>;
};
