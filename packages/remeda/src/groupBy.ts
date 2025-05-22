import type { BoundedPartial } from "./internal/types/BoundedPartial";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import { purry } from "./purry";

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping by a property (e.g. `groupBy(data, ({ prop }) => prop)`
 * or `groupBy(data, prop('prop'))`) consider using `groupByProp` instead, as
 * it would provide better typing).
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
): BoundedPartial<Record<Key, NonEmptyArray<T>>>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping by a property (e.g. `groupBy(data, ({ prop }) => prop)`
 * or `groupBy(data, prop('prop'))`) consider using `groupByProp` instead, as
 * it would provide better typing).
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
): (items: ReadonlyArray<T>) => BoundedPartial<Record<Key, NonEmptyArray<T>>>;

export function groupBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(groupByImplementation, args);
}

const groupByImplementation = <T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): BoundedPartial<Record<Key, NonEmptyArray<T>>> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Using Object.create(null) allows us to remove everything from the prototype chain, leaving it as a pure object that only has the keys *we* add to it. This prevents issues like the one raised in #1046
  const output: BoundedPartial<Record<Key, NonEmptyArray<T>>> =
    Object.create(null);

  for (let index = 0; index < data.length; index++) {
    // Accessing the object directly instead of via an iterator on the `entries` showed significant performance benefits while benchmarking.
    const item = data[index];

    // @ts-expect-error [ts2345] -- TypeScript is not able to infer that the index wouldn't overflow the array and that it shouldn't add `undefined` to the type. We don't want to use the `!` operator here because it's semantics are different because it changes the type of `item` to `NonNullable<T>` which is inaccurate because T itself could have `undefined` as a valid value.
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      // Once the prototype chain is fixed, it is safe to access the prop directly without needing to check existence or types.
      const items = output[key];

      if (items === undefined) {
        // It is more performant to create a 1-element array over creating an empty array and falling through to a unified the push. It is also more performant to mutate the existing object over using spread to continually create new objects on every unique key.
        // @ts-expect-error [ts2322] -- In addition to the typing issue we have for `item`, this line also creates a typing issue for the whole object, as TypeScript is having a hard time inferring what values could be adding to the object.
        output[key] = [item];
      } else {
        // It is more performant to add the items to an existing array over continually creating a new array every time we add an item to it.
        // @ts-expect-error [ts2345] -- See comment above about the effective typing for `item` here.
        items.push(item);
      }
    }
  }

  // Set the prototype as if we initialized our object as a normal object (e.g. `{}`). Without this none of the built-in object methods like `toString` would work on this object and it would act differently than expected.
  Object.setPrototypeOf(output, Object.prototype);

  return output;
};
