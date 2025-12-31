import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { IsEqual, Join } from "type-fest";

//#region src/swapIndices.d.ts
type Difference<A extends number, B extends number> = TupleOfLength<A> extends [...infer U, ...TupleOfLength<B>] ? U["length"] : never;
type isLessThan<A extends number, B extends number> = IsEqual<A, B> extends true ? false : 0 extends A ? true : 0 extends B ? false : isLessThan<Difference<A, 1>, Difference<B, 1>>;
type TupleOfLength<L extends number, T extends IterableContainer = []> = T["length"] extends L ? T : TupleOfLength<L, [...T, unknown]>;
type IsNonNegative<T extends number> = number extends T ? false : `${T}` extends `-${string}` ? false : true;
type CharactersTuple<T extends string> = string extends T ? Array<string> : T extends `${infer C}${infer R}` ? [C, ...CharactersTuple<R>] : [];
type SwapArrayInternal<T extends IterableContainer, Index1 extends number, Index2 extends number, Position extends ReadonlyArray<unknown> = [], Original extends IterableContainer = T> = T extends readonly [infer AtPosition, ...infer Rest] ? [Position["length"] extends Index1 ? Original[Index2] : Position["length"] extends Index2 ? Original[Index1] : AtPosition, ...SwapArrayInternal<Rest, Index1, Index2, [unknown, ...Position], Original>] : T;
type SwapString<T extends string, K1 extends number, K2 extends number> = Join<SwapArray<CharactersTuple<T>, K1, K2>, "">;
type SwapArray<T extends IterableContainer, K1 extends number, K2 extends number> = IsNonNegative<K1> extends false ? Array<T[number]> : IsNonNegative<K2> extends false ? Array<T[number]> : isLessThan<K1, T["length"]> extends false ? T : isLessThan<K2, T["length"]> extends false ? T : SwapArrayInternal<T, K1, K2>;
type SwappedIndices<T extends IterableContainer | string, K1 extends number, K2 extends number> = T extends string ? SwapString<T, K1, K2> : T extends IterableContainer ? SwapArray<T, K1, K2> : never;
/**
 * Swaps the positions of two elements in an array or string at the provided indices.
 *
 * Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.
 *
 * If either index is out of bounds the result would be a shallow copy of the input, as-is.
 *
 * @param data - The item to be manipulated. This can be an array, or a string.
 * @param index1 - The first index.
 * @param index2 - The second index.
 * @returns Returns the manipulated array or string.
 * @signature
 *   swapIndices(data, index1, index2)
 * @example
 *   swapIndices(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swapIndices(['a', 'b', 'c'], 1, -1) // => ['a', 'c', 'b']
 *   swapIndices('abc', 0, 1) // => 'bac'
 * @dataFirst
 * @category Array
 */
declare function swapIndices<T extends IterableContainer | string, K1 extends number, K2 extends number>(data: T, index1: K1, index2: K2): SwappedIndices<T, K1, K2>;
/**
 * Swaps the positions of two elements in an array or string at the provided indices.
 *
 * Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.
 *
 * If either index is out of bounds the result would be a shallow copy of the input, as-is.
 *
 * @param index1 - The first index.
 * @param index2 - The second index.
 * @returns Returns the manipulated array or string.
 * @signature
 *   swapIndices(index1, index2)(data)
 * @example
 *   swapIndices(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swapIndices(0, -1)('abc') // => 'cba'
 * @dataLast
 * @category Array
 */
declare function swapIndices<K1 extends number, K2 extends number>(index1: K1, index2: K2): <T extends IterableContainer | string>(data: T) => SwappedIndices<T, K1, K2>;
//#endregion
export { swapIndices as t };
//# sourceMappingURL=swapIndices-bMi0dVl3.d.cts.map