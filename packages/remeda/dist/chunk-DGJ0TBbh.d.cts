import { t as IntRangeInclusive } from "./IntRangeInclusive-D_Hjivh-.cjs";
import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as NTuple } from "./NTuple-CUR-WfG6.cjs";
import { t as NonEmptyArray } from "./NonEmptyArray-DWDdw6tr.cjs";
import { t as PartialArray } from "./PartialArray-vJGoNMaK.cjs";
import { t as TupleParts } from "./TupleParts-CqxD-ozC.cjs";
import { IntRange, IsNever, IsNumericLiteral, LessThan, Subtract, ValueOf } from "type-fest";

//#region src/chunk.d.ts
type MAX_LITERAL_SIZE = 350;
type Chunk<T extends IterableContainer, N extends number> = T extends readonly [] ? [] : IsNumericLiteral<N> extends true ? LessThan<N, 1> extends true ? never : LessThan<N, MAX_LITERAL_SIZE> extends true ? [...LiteralChunk<T, N>] : GenericChunk<T> : GenericChunk<T>;
type LiteralChunk<T extends IterableContainer, N extends number> = ChunkRestElement<ChunkFixedTuple<TuplePrefix<T>, N>, TupleParts<T>["item"], TupleParts<T>["suffix"], N> | ([...TuplePrefix<T>, ...TupleParts<T>["suffix"]] extends readonly [] ? [] : never);
/**
 * This type **only** works if the input array `T` is a fixed tuple. For these
 * inputs the chunked output could be computed as literal finite tuples too.
 */
type ChunkFixedTuple<T, N extends number, Result = []> = T extends readonly [infer Head, ...infer Rest] ? ChunkFixedTuple<Rest, N, Result extends [...infer Previous extends Array<Array<unknown>>, infer Current extends Array<unknown>] ? Current["length"] extends N ? [...Previous, Current, [Head]] : [...Previous, [...Current, Head]] : [[Head]]> : Result;
/**
 * Here lies the main complexity of building the chunk type. It takes the prefix
 * chunks, the rest param item type, and the suffix (not chunked!) and it
 * creates all possible combinations of adding items to the prefix and suffix
 * for all possible scenarios for how many items the rest param "represents".
 */
type ChunkRestElement<PrefixChunks, Item, Suffix extends Array<unknown>, N extends number> = IsNever<Item> extends true ? PrefixChunks : PrefixChunks extends [...infer PrefixFullChunks extends Array<Array<unknown>>, infer LastPrefixChunk extends Array<unknown>] ? ValueOf<{ [Padding in IntRangeInclusive<0, Subtract<N, LastPrefixChunk["length"]>>]: [...PrefixFullChunks, ...ChunkFixedTuple<[...LastPrefixChunk, ...NTuple<Item, Padding>, ...Suffix], N>] }> | [...PrefixFullChunks, [...LastPrefixChunk, ...NTuple<Item, Subtract<N, LastPrefixChunk["length"]>>], ...Array<NTuple<Item, N>>, ...SuffixChunk<Suffix, Item, N>] : [...Array<NTuple<Item, N>>, ...SuffixChunk<Suffix, Item, N>];
/**
 * This type assumes it takes a finite tuple that represents the suffix of our
 * input array. It builds all possible combinations of adding items to the
 * **head** of the suffix in order to pad the suffix until the last chunk is
 * full.
 */
type SuffixChunk<T extends Array<unknown>, Item, N extends number> = T extends readonly [] ? [ValueOf<{ [K in IntRangeInclusive<1, N>]: NTuple<Item, K> }>] : ValueOf<{ [Padding in IntRange<0, N>]: ChunkFixedTuple<[...NTuple<Item, Padding>, ...T], N> }>;
/**
 * This is the legacy type used when we don't know what N is. We can only adjust
 * our output based on if we know for sure that the array is empty or not.
 */
type GenericChunk<T extends IterableContainer> = T extends readonly [...Array<unknown>, unknown] | readonly [unknown, ...Array<unknown>] ? NonEmptyArray<NonEmptyArray<T[number]>> : Array<NonEmptyArray<T[number]>>;
type TuplePrefix<T extends IterableContainer> = [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>];
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param array - The array.
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(array, size)
 * @example
 *    R.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @dataFirst
 * @category Array
 */
declare function chunk<T extends IterableContainer, N extends number>(array: T, size: N): Chunk<T, N>;
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(size)(array)
 * @example
 *    R.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @dataLast
 * @category Array
 */
declare function chunk<N extends number>(size: N): <T extends IterableContainer>(array: T) => Chunk<T, N>;
//#endregion
export { chunk as t };
//# sourceMappingURL=chunk-DGJ0TBbh.d.cts.map