import type { Simplify } from "type-fest";
import { purry } from "./purry";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import type { IsReadonlyRecord } from "./internal/types/IsReadonlyRecord";

type GroupByProp<
  T extends Array<Record<PropertyKey, unknown> & Record<Prop, PropertyKey>>,
  Prop extends keyof T[number],
> =
  IsReadonlyRecord<T[number]> extends true
    ? Simplify<GroupByPropAcc<T, Prop>>
    : Simplify<{
        [P in T[number][Prop]]:
          | NonEmptyArray<Extract<T, Record<Prop, P>>>
          | undefined;
      }>;

/** Helper type that recursively traverses items (tuples) and merges them into ACC. */
type GroupByPropAcc<
  Items extends Array<unknown>,
  Prop extends PropertyKey,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- it is used as the initial value.
  Acc extends Record<PropertyKey, Array<unknown>> = {},
> = Items extends [infer Head, ...infer Rest]
  ? Head extends Record<Prop, PropertyKey>
    ? GroupByPropAcc<Rest, Prop, MergeGroup<Acc, Head[Prop], Head>>
    : GroupByPropAcc<Rest, Prop, Acc>
  : Acc;

/** Helper type to add items to each group. */
type MergeGroup<
  Acc extends Record<PropertyKey, Array<unknown>>,
  Prop extends PropertyKey,
  Item,
> = {
  [P in keyof Acc | Prop]: P extends Prop
    ? P extends keyof Acc
      ? [...Acc[P], Item]
      : [Item]
    : P extends keyof Acc
      ? Acc[P]
      : never;
};

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
  T extends Array<Record<PropertyKey, unknown> & Record<Prop, PropertyKey>>,
  Prop extends keyof T[number],
>(data: T, prop: Prop): GroupByProp<T, Prop>;

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
  T extends Array<Record<PropertyKey, unknown> & Record<Prop, PropertyKey>>,
  Prop extends keyof T[number],
>(prop: Prop): (data: T) => GroupByProp<T, Prop>;

export function groupByProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(groupByPropImplementation, args);
}

const groupByPropImplementation = <
  T extends Array<Record<PropertyKey, unknown> & Record<Prop, PropertyKey>>,
  Prop extends keyof T[number],
>(
  data: T,
  prop: Prop,
): GroupByProp<T, Prop> => {
  const output = new Map<PropertyKey, Array<T[number]>>();

  for (const item of data) {
    const key = item[prop];
    let items = output.get(key);
    if (items === undefined) {
      items = [];
      output.set(key, items);
    }
    items.push(item);
  }

  return Object.fromEntries(output) as GroupByProp<T, Prop>;
};
