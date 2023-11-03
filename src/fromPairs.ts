import { IterableContainer } from './_types';

type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [
  key: Key,
  value: Value,
];

/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 * @param pairs the list of input tuples
 * @signature
 *   R.fromPairs(tuples)
 *   R.fromPairs.strict(tuples)
 * @example
 *   R.fromPairs([['a', 'b'], ['c', 'd']]) // => {a: 'b', c: 'd'} (type: Record<string, string>)
 *   R.fromPairs.strict(['a', 1] as const) // => {a: 1} (type: {a: 1})
 * @category Object
 * @strict
 */
export function fromPairs<V>(
  pairs: ReadonlyArray<Entry<number, V>>
): Record<number, V>;
export function fromPairs<V>(
  pairs: ReadonlyArray<Entry<string, V>>
): Record<string, V>;

export function fromPairs(
  entries: ReadonlyArray<Entry>
): Record<string, unknown> {
  const out: Record<PropertyKey, unknown> = {};
  for (const [key, value] of entries) {
    out[key] = value;
  }
  return out;
}

// Redefining the fromPairs function to allow stricter pairs arrays and fine-
// grained handling of partiality of the output.
type Strict = <Entries extends IterableContainer<Entry>>(
  entries: Entries
) => StrictOut<Entries>;

// The 2 kinds of arrays we accept result in different kinds of outputs:
// 1. If the input is a *tuple*, we know exactly what pairs it would hold,
// and thus can type the result so that the keys are required. We will then run
// recusrisvely on the rest of the tuple.
// 2. If the input is an *array* then any keys defined in the array might not
// actually show up in runtime, and thus need to be optional. (e.g. if the input
// is an empty array).
type StrictOut<Entries> = Entries extends readonly [infer First, ...infer Tail]
  ? FromPairsTuple<First, Tail>
  : Entries extends readonly [...infer Head, infer Last]
  ? FromPairsTuple<Last, Head>
  : Entries extends IterableContainer<Entry>
  ? FromPairsArray<Entries>
  : 'ERROR: Entries array-like could not be infered';

// For strict tuples we build the result by intersecting each pair as a record
// between it's key and value, recursively. The recursion goes through our main
// type so that we support tuples which also contain rest parts.
type FromPairsTuple<E, Rest> = E extends Entry
  ? Record<E[0], E[1]> & StrictOut<Rest>
  : 'ERROR: Array-like contains a non-entry element';

// For the array case we also need to handle what kind of keys it defines:
// 1. If it defines a *broad* key (one that has an infinite set of values, like
// number or string) then the result is a simple record.
// 2. If the keys are *literals* then we need to make the record partial
// (because those props are explicit), and we need to match each key it's
// specific possible value, as defined by the pairs.
//
// Note that this destinction between keys is the result of how typescript
// considers Record<string, unknown> to be **implicitly** partial, whereas
// Record<"a", unknown> is not.
type FromPairsArray<Entries extends IterableContainer<Entry>> =
  string extends AllKeys<Entries>
    ? Record<string, Entries[number][1]>
    : number extends AllKeys<Entries>
    ? Record<number, Entries[number][1]>
    : symbol extends AllKeys<Entries>
    ? Record<symbol, Entries[number][1]>
    : FromPairsArrayWithLiteralKeys<Entries>;

// This type is largely copied from `objectFromEntries` in the repo:
// *sindresorhus/ts-extras* but makes all properties of the output optional,
// which is more correct because we can't assure that an entry will exist for
// every possible prop/key of the input.
// @see https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-from-entries.ts)
type FromPairsArrayWithLiteralKeys<Entries extends IterableContainer<Entry>> = {
  [K in AllKeys<Entries>]?: ValueForKey<Entries, K>;
};

type AllKeys<Entries extends IterableContainer<Entry>> = Extract<
  Entries[number],
  Entry
>[0];

type ValueForKey<
  Entries extends IterableContainer<Entry>,
  K extends PropertyKey,
> =
  // I tried and failed to simplify the type here! What the ternary does here is
  // to support the cases where the entries are defined by a single type that
  // defines all entries, but it defines the keys as a union of literals
  // (`['a' | 'b', number]`); which is different from the output of toPairs
  // which would define a separate tuple literal for each key (`['a', number] |
  // ['b', number]`). We need to support both cases!
  (Extract<Entries[number], Entry<K>> extends never
    ? Entries[number]
    : Extract<Entries[number], Entry<K>>)[1];

export namespace fromPairs {
  // Strict is simply a retyping of fromPairs, it runs the same runtime logic.
  export const strict: Strict = fromPairs;
}
