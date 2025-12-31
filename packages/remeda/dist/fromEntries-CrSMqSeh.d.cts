import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as RemedaTypeError } from "./RemedaTypeError-DGiM-bRZ.cjs";
import { Simplify } from "type-fest";

//#region src/fromEntries.d.ts
type FromEntriesError<Message extends string> = RemedaTypeError<"fromEntries", Message>;
type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [key: Key, value: Value];
type FromEntries<Entries> = Entries extends readonly [infer First, ...infer Tail] ? FromEntriesTuple<First, Tail> : Entries extends readonly [...infer Head, infer Last] ? FromEntriesTuple<Last, Head> : Entries extends IterableContainer<Entry> ? FromEntriesArray<Entries> : FromEntriesError<"Entries array-like could not be inferred">;
type FromEntriesTuple<E, Rest> = E extends Entry ? FromEntries<Rest> & Record<E[0], E[1]> : FromEntriesError<"Array-like contains a non-entry element">;
type FromEntriesArray<Entries extends IterableContainer<Entry>> = string extends AllKeys<Entries> ? Record<string, Entries[number][1]> : number extends AllKeys<Entries> ? Record<number, Entries[number][1]> : symbol extends AllKeys<Entries> ? Record<symbol, Entries[number][1]> : FromEntriesArrayWithLiteralKeys<Entries>;
type FromEntriesArrayWithLiteralKeys<Entries extends IterableContainer<Entry>> = { [P in AllKeys<Entries>]?: ValueForKey<Entries, P> };
type AllKeys<Entries extends IterableContainer<Entry>> = Extract<Entries[number], Entry>[0];
type ValueForKey<Entries extends IterableContainer<Entry>, K extends PropertyKey> = (Extract<Entries[number], Entry<K>> extends never ? Entries[number] : Extract<Entries[number], Entry<K>>)[1];
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
declare function fromEntries<Entries extends IterableContainer<Entry>>(entries: Entries): Simplify<FromEntries<Entries>>;
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
declare function fromEntries(): <Entries extends IterableContainer<Entry>>(entries: Entries) => Simplify<FromEntries<Entries>>;
//#endregion
export { fromEntries as t };
//# sourceMappingURL=fromEntries-CrSMqSeh.d.cts.map