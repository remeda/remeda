import type { IterableContainer } from "./_types";
import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [
  key: Key,
  value: Value,
];

// The 2 kinds of arrays we accept result in different kinds of outputs:
// 1. If the input is a *tuple*, we know exactly what entries it would hold,
// and thus can type the result so that the keys are required. We will then run
// recursively on the rest of the tuple.
// 2. If the input is an *array* then any keys defined in the array might not
// actually show up in runtime, and thus need to be optional. (e.g. if the input
// is an empty array).
type FromEntries<Entries> = Entries extends readonly [
  infer First,
  ...infer Tail,
]
  ? FromEntriesTuple<First, Tail>
  : Entries extends readonly [...infer Head, infer Last]
    ? FromEntriesTuple<Last, Head>
    : Entries extends IterableContainer<Entry>
      ? FromEntriesArray<Entries>
      : "ERROR: Entries array-like could not be inferred";

// For strict tuples we build the result by intersecting each entry as a record
// between it's key and value, recursively. The recursion goes through our main
// type so that we support tuples which also contain rest parts.
type FromEntriesTuple<E, Rest> = E extends Entry
  ? FromEntries<Rest> & Record<E[0], E[1]>
  : "ERROR: Array-like contains a non-entry element";

// For the array case we also need to handle what kind of keys it defines:
// 1. If it defines a *broad* key (one that has an infinite set of values, like
// number or string) then the result is a simple record.
// 2. If the keys are *literals* then we need to make the record partial
// (because those props are explicit), and we need to match each key it's
// specific possible value, as defined by the entries.
//
// Note that this destination between keys is the result of how typescript
// considers Record<string, unknown> to be **implicitly** partial, whereas
// Record<"a", unknown> is not.
type FromEntriesArray<Entries extends IterableContainer<Entry>> =
  string extends AllKeys<Entries>
    ? Record<string, Entries[number][1]>
    : number extends AllKeys<Entries>
      ? Record<number, Entries[number][1]>
      : symbol extends AllKeys<Entries>
        ? Record<symbol, Entries[number][1]>
        : FromEntriesArrayWithLiteralKeys<Entries>;

// This type is largely copied from `objectFromEntries` in the repo:
// *sindresorhus/ts-extras* but makes all properties of the output optional,
// which is more correct because we can't assure that an entry will exist for
// every possible prop/key of the input.
// @see https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-from-entries.ts)
type FromEntriesArrayWithLiteralKeys<Entries extends IterableContainer<Entry>> =
  {
    [P in AllKeys<Entries>]?: ValueForKey<Entries, P>;
  };

type AllKeys<Entries extends IterableContainer<Entry>> = Extract<
  Entries[number],
  Entry
>[0];

// I tried and failed to simplify the type here! What the ternary does here is
// to support the cases where the entries are defined by a single type that
// defines all entries, but it defines the keys as a union of literals
// (`['a' | 'b', number]`); which is different from the output of toPairs
// which would define a separate tuple literal for each key (`['a', number] |
// ['b', number]`). We need to support both cases!
type ValueForKey<
  Entries extends IterableContainer<Entry>,
  K extends PropertyKey,
> = (Extract<Entries[number], Entry<K>> extends never
  ? Entries[number]
  : Extract<Entries[number], Entry<K>>)[1];

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
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
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
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
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
