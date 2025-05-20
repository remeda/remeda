import type { AllUnionFields, SimplifyDeep } from "type-fest";
import type { ArrayRequiredPrefix } from "./internal/types/ArrayRequiredPrefix";
import type { FilteredArray } from "./internal/types/FilteredArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

// We need to use AllUnionFields to convert a union of objects into a single type that would extend all of them, and thus provide a better representation of what the groupBy loop would need to handle.
type GroupableBy<T> = SingleObjectGroupableBy<AllUnionFields<T>>;

type SingleObjectGroupableBy<U> = {
  // We make all props required in the output to prevent optional props from adding `| undefined` to our output type.
  [P in keyof U]-?: U[P] extends PropertyKey | undefined ? P : never; // Only PropertyKeys can be used in the output grouped object, so props with other types need to be filtered out. We include `undefined` to allow groupBy to filter out items which can't be grouped.
}[keyof U];

type GroupByProp<
  T extends ReadonlyArray<unknown> | [],
  P extends GroupableBy<T[number]>,
> = SimplifyDeep<{
  [GroupKey in AllUnionFields<T[number]>[P] & PropertyKey]: ArrayRequiredPrefix<
    FilteredArray<T, Record<P, GroupKey>>,
    1
  >;
}>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided prop.
 * The returned object has separate properties for each group, containing
 * arrays with the elements in the group.
 * Unlike `groupBy`, it provides full type inference when `data` is static.
 *
 * @param data - The items to group.
 * @param prop - The prop to group by.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupByProp(data, prop)
 * @example
 *    R.groupByProp([{a: 'cat'}, {a: 'dog'}] as const, 'a') // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 * @dataFirst
 * @category Array
 */
export function groupByProp<
  T extends IterableContainer,
  P extends GroupableBy<T[number]>,
>(data: T, prop: P): GroupByProp<T, P>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided prop.
 * The returned object has separate properties for each group, containing
 * arrays with the elements in the group.
 * Unlike `groupBy`, it provides full type inference when `data` is static.
 *
 * @param prop - The prop to group by.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupByProp(prop)(data);
 * @example
 *    R.pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      R.groupByProp('a'),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 * @dataLast
 * @category Array
 */
export function groupByProp<
  T extends IterableContainer,
  P extends GroupableBy<T[number]>,
>(prop: P): (data: T) => GroupByProp<T, P>;

export function groupByProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(groupByPropImplementation, args);
}

const groupByPropImplementation = <
  T extends IterableContainer,
  P extends GroupableBy<T[number]>,
>(
  data: T,
  prop: P,
): GroupByProp<T, P> => {
  const output = new Map<PropertyKey, Array<T[number]>>();

  for (const item of data) {
    // @ts-expect-error [ts18046] -- TODO...
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const key = item[prop];
    if (key !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const items = output.get(key);
      if (items === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        output.set(key, [item]);
      } else {
        items.push(item);
      }
    }
  }

  return Object.fromEntries(output) as GroupByProp<T, P>;
};
