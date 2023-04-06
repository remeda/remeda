import { IterableContainer } from './_types';

type Pair<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [
  key: Key,
  value: Value
];

/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 * @param tuples the list of input tuples
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
  tuples: ReadonlyArray<Pair<number, V>>
): Record<number, V>;
export function fromPairs<V>(
  tuples: ReadonlyArray<Pair<string, V>>
): Record<string, V>;

export function fromPairs(
  tuples: ReadonlyArray<Pair>
): Record<string, unknown> {
  const out: Record<PropertyKey, unknown> = {};
  for (const [key, value] of tuples) {
    out[key] = value;
  }
  return out;
}

// Redefining the fromPairs function to allow stricter pairs arrays and fine-
// grained handling of partiality of the output.
type Strict = <
  Key extends PropertyKey,
  Entries extends ReadonlyArray<Pair<Key>>
>(
  items: Entries
) => StrictOut<Key, Entries>;

// The 2 kinds of arrays we accept result in different kinds of output.
// 1. If the input is a strict tuple, we know exactly what pairs it would hold,
// and thus can type the result so that all keys are required.
// 2. If the input is an array (or a tuple with a rest part) then any keys
// defined in the array might not actually show up in runtime, and thus need to
// be optional in order (e.g. if the input is an empty array).
type StrictOut<
  Key extends PropertyKey,
  Entries extends IterableContainer<Pair<Key>>
> = Entries extends readonly [infer First, ...infer Rest]
  ? FromPairsTuple<Key, First, Rest>
  : Entries extends readonly [...infer Rest, infer Last]
  ? FromPairsTuple<Key, Last, Rest>
  : FromPairsArray<Key, Entries>;

// For the array case we also need to handle what kind of keys it defines:
// 1. If it defines a generic key (one that has an infinite set of values, like
// number or even `myTemplate_${string}`) then the result is a simple record.
// 2. But if the keys are literal types, then we need to make the record
// partial (because those props are explicit), and we need to match each key
// it's specific possible value, as defined by the pairs.
//
// Note that this destinction between keys is the result of how typescript
// considers Record<string, unknown> to be **implicitly** partial, whereas
// Record<"a", unknown> is not.
type FromPairsArray<
  Key extends PropertyKey,
  Entries extends IterableContainer<Pair<Key>>
> = string extends Extract<Entries[number], readonly [Key, unknown]>[0]
  ? Record<string, Entries[number][1]>
  : number extends Extract<Entries[number], readonly [Key, unknown]>[0]
  ? Record<number, Entries[number][1]>
  : symbol extends Extract<Entries[number], readonly [Key, unknown]>[0]
  ? Record<symbol, Entries[number][1]>
  : FromPairsArrayWithLiteralKeys<Key, Entries>;

// This type is largely copied from ts-extra's objectFromEntries. The only
// change I did was make the mapping optional because we only use this type for
// the cases where the keys are literals.
// @see https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-from-entries.ts)
type FromPairsArrayWithLiteralKeys<
  Key extends PropertyKey,
  Entries extends IterableContainer<Pair<Key>>
> = {
  [K in Extract<Entries[number], readonly [Key, unknown]>[0]]?: Extract<
    Entries[number],
    readonly [K, unknown]
  >[1];
};

// For strict tuples we build the result by intersecting each pair as a record
// between it's key and value, recursively. The recursion goes through our main
// type so that we support tuples which also contain rest parts.
type FromPairsTuple<
  Key extends PropertyKey,
  Entry,
  OtherEntries
> = Entry extends Pair<Key>
  ? OtherEntries extends ReadonlyArray<Pair<Key>>
    ? Record<Entry[0], Entry[1]> & StrictOut<Key, OtherEntries>
    : never
  : never;

export namespace fromPairs {
  // Strict is simply a retyping of fromPairs, it runs the same runtime logic.
  export const strict: Strict = fromPairs;
}
