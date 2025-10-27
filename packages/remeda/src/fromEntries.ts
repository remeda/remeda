import type { IsNever, Simplify } from "type-fest";
import type { IsBounded } from "./internal/types/IsBounded";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [
  key: Key,
  value: Value,
];

type FromEntries<T extends IterableContainer<Entry>> = Simplify<
  FromEntriesTuple<TupleParts<T>["required"]> &
    FromEntriesTuple<TupleParts<T>["optional"], "optional"> &
    ProcessRestEntries<TupleParts<T>["item"]> &
    FromEntriesTuple<TupleParts<T>["suffix"]>
>;

type FromEntriesTuple<
  T,
  Mode extends "required" | "optional" = "required",
> = T extends readonly [infer Head extends Entry, ...infer Rest]
  ? FromEntry<Head, Mode> & FromEntriesTuple<Rest, Mode>
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

type ProcessRestEntries<T extends Entry> =
  IsNever<T> extends true
    ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
    : FromEntry<T, "optional">;

type FromEntry<
  T extends Entry,
  Mode extends "required" | "optional",
> = T extends unknown ? PartializeOptionals<Record<T[0], T[1]>, Mode> : never;

type PartializeOptionals<
  T,
  Mode extends "required" | "optional",
> = "optional" extends Mode
  ? IsBounded<keyof T> extends true
    ? Partial<T>
    : T
  : T;

/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * Refer to the docs for more details.
 *
 * @param entries - An array of key-value pairs.
 * @signature
 *   R.fromEntries(tuples)
 * @example
 *   R.fromEntries([['a', 'b'], ['c', 'd']]); // => {a: 'b', c: 'd'}
 * @dataFirst
 * @category Object
 */
export function fromEntries<Entries extends IterableContainer<Entry>>(
  entries: Entries,
): Simplify<FromEntries<Entries>>;

/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * Refer to the docs for more details.
 *
 * @signature
 *   R.fromEntries()(tuples)
 * @example
 *   R.pipe(
 *     [['a', 'b'], ['c', 'd']] as const,
 *     R.fromEntries(),
 *   ); // => {a: 'b', c: 'd'}
 * @dataLast
 * @category Object
 */
export function fromEntries(): <Entries extends IterableContainer<Entry>>(
  entries: Entries,
) => Simplify<FromEntries<Entries>>;

export function fromEntries(...args: ReadonlyArray<unknown>): unknown {
  return purry(Object.fromEntries, args);
}
