import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { BoundedPartial } from "./internal/types/BoundedPartial";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping objects by a property of theirs (e.g.
 * `groupBy(data, ({ myProp }) => myProp)` or `groupBy(data, prop('myProp'))`)
 * consider using `groupByProp` (e.g. `groupByProp(data, 'myProp')`) instead,
 * as it would provide better typing.
 *
 * @param data - The items to group.
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    groupBy(data, callbackfn)
 * @example
 *    groupBy([{a: 'cat'}, {a: 'dog'}] as const, prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  data: readonly T[],
  callbackfn: ArrayCallback<readonly T[], Key | undefined>,
): BoundedPartial<Record<Key, NonEmptyArray<T>>>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping objects by a property of theirs (e.g.
 * `groupBy(data, ({ myProp }) => myProp)` or `groupBy(data, prop('myProp'))`)
 * consider using `groupByProp` (e.g. `groupByProp(data, 'myProp')`) instead,
 * as it would provide better typing.
 *
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    groupBy(callbackfn)(data);
 * @example
 *    pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      groupBy(prop('a')),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    pipe(
 *      [0, 1],
 *      groupBy(x => x % 2 === 0 ? 'even' : undefined),
 *    ); // => {even: [0]}
 * @dataLast
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  callbackfn: ArrayCallback<readonly T[], Key | undefined>,
): (data: readonly T[]) => BoundedPartial<Record<Key, NonEmptyArray<T>>>;

export function groupBy(
  dataOrCallbackfn:
    | readonly unknown[]
    | ArrayCallback<readonly unknown[], PropertyKey | undefined>,
  callbackfn?: ArrayCallback<readonly unknown[], PropertyKey | undefined>,
): unknown {
  return typeof dataOrCallbackfn === "function"
    ? dataLast(dataOrCallbackfn)
    : groupByImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof groupByImplementation> =
  (callbackfn) => (data) =>
    groupByImplementation(data, callbackfn);

const groupByImplementation = <T, Key extends PropertyKey = PropertyKey>(
  data: readonly T[],
  callbackfn: (value: T, index: number, data: readonly T[]) => Key | undefined,
): BoundedPartial<Record<Key, NonEmptyArray<T>>> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Using Object.create(null) allows us to remove everything from the prototype chain, leaving it as a pure object that only has the keys *we* add to it. This prevents issues like the one raised in #1046
  const output: BoundedPartial<Record<Key, NonEmptyArray<T>>> =
    Object.create(null);

  data.forEach((item, index) => {
    const key = callbackfn(item, index, data);
    if (key === undefined) {
      return;
    }

    // Once the prototype chain is fixed, it is safe to access the prop directly without needing to check existence or types.
    const items = output[key];

    if (items === undefined) {
      // It is more performant to create a 1-element array over creating an
      // empty array and falling through to a unified push. It is also more
      // performant to mutate the existing object over using spread to
      // continually create new objects on every unique key.
      // @ts-expect-error [ts2322] -- TypeScript is having a hard time inferring what values could be added to the object.
      output[key] = [item];
    } else {
      // It is more performant to add the items to an existing array over
      // continually creating a new array every time we add an item to it.
      items.push(item);
    }
  });

  // Set the prototype as if we initialized our object as a normal object
  // (e.g., `{}`). Without this none of the built-in object methods like
  // `toString` would work on this object and it would act differently than
  // expected.
  // TODO [>2]: Consider removing this line and returning the object with its null prototype, as `Object.groupBy` does. In V8 this call gives every result a hidden class of its own, which costs about 85ns per call and 55ns per read of a fresh result. It needs a major version because a null prototype breaks inherited methods (e.g., `hasOwnProperty`), string coercion, `toStrictEqual` assertions, and passing the result from a React Server Component to a Client Component, none of which are type errors.
  Object.setPrototypeOf(output, Object.prototype);

  return output;
};
