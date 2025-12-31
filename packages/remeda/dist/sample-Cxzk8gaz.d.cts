import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as NTuple } from "./NTuple-CUR-WfG6.cjs";
import { t as PartialArray } from "./PartialArray-vJGoNMaK.cjs";
import { t as TupleParts } from "./TupleParts-CqxD-ozC.cjs";
import { t as CoercedArray } from "./CoercedArray-DlHZGNXy.cjs";
import { FixedLengthArray, IsEqual, IsNever, NonNegativeInteger, Or, Writable } from "type-fest";

//#region src/sample.d.ts
type Sampled<T extends IterableContainer, N extends number> = Or<IsEqual<N, 0>, IsEqual<T["length"], 0>> extends true ? [] : IsNever<NonNegativeInteger<N>> extends true ? SampledPrimitive<T> : IsLongerThan<T, N> extends true ? SampledLiteral<T, N> : Writable<T>;
/**
 * When N is not a non-negative integer **literal** we can't use it in our
 * reconstructing logic so we fallback to a simpler definition of the output of
 * sample, which is any sub-tuple shape of T, of **any length**.
 */
type SampledPrimitive<T extends IterableContainer> = [...FixedSubTuples<TupleParts<T>["required"]>, ...PartialArray<FixedSubTuples<TupleParts<T>["optional"]>>, ...CoercedArray<TupleParts<T>["item"]>, ...FixedSubTuples<TupleParts<T>["suffix"]>];
/**
 * Knowing N is a non-negative literal integer we can construct all sub-tuples
 * of T that are exactly N elements long.
 */
type SampledLiteral<T extends IterableContainer, N extends number> = Extract<FixedSubTuples<[...TupleParts<T>["required"], ...(IsNever<TupleParts<T>["item"]> extends true ? [] : NTuple<TupleParts<T>["item"], N>), ...TupleParts<T>["suffix"]]>, FixedLengthArray<unknown, N>> | SubSampled<TupleParts<T>["required"], TupleParts<T>["item"], TupleParts<T>["suffix"], N>;
type SubSampled<Prefix extends ReadonlyArray<unknown>, Item, Suffix extends ReadonlyArray<unknown>, N extends number> = IsLongerThan<[...Prefix, ...Suffix], N> extends true ? never : [...Prefix, ...Suffix]["length"] extends N ? never : [...Prefix, ...Suffix] | SubSampled<[...Prefix, Item], Item, Suffix, N>;
type IsLongerThan<T extends ReadonlyArray<unknown>, N extends number> = IsEqual<T[N], undefined> extends true ? false : true;
type FixedSubTuples<T> = T extends readonly [infer Head, ...infer Rest] ?
// For each element we either take it or skip it, and recurse over the rest.
FixedSubTuples<Rest> | [Head, ...FixedSubTuples<Rest>] : [];
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param data - The array.
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(array, sampleSize)
 * @example
 *    R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
 *    R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
 * @dataFirst
 * @category Array
 */
declare function sample<const T extends IterableContainer, N extends number>(data: T, sampleSize: N): Sampled<T, N>;
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(sampleSize)(array)
 * @example
 *    R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
 *    R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
 * @dataLast
 * @category Array
 */
declare function sample<const T extends IterableContainer, N extends number>(sampleSize: N): (data: T) => Sampled<T, N>;
//#endregion
export { sample as t };
//# sourceMappingURL=sample-Cxzk8gaz.d.cts.map