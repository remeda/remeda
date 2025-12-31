import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as PartialArray } from "./PartialArray-ChqAZrje.js";
import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { t as ClampedIntegerSubtract } from "./ClampedIntegerSubtract-RjA0M8T2.js";
import { t as CoercedArray } from "./CoercedArray-DxS6j_hV.js";
import { IsInteger, IsNegative, Writable } from "type-fest";

//#region src/drop.d.ts
type Drop<T extends IterableContainer, N extends number> = IsNegative<N> extends true ? Writable<T> : IsInteger<N> extends false ? Array<T[number]> : ClampedIntegerSubtract<N, TupleParts<T>["required"]["length"]> extends infer RemainingPrefix extends number ? RemainingPrefix extends 0 ? [...DropFixedTuple<TupleParts<T>["required"], N>, ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] : ClampedIntegerSubtract<RemainingPrefix, TupleParts<T>["optional"]["length"]> extends infer RemainingOptional extends number ? RemainingOptional extends 0 ? [...PartialArray<DropFixedTuple<TupleParts<T>["optional"], RemainingPrefix>>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] : [...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] | Exclude<DropFixedTuple<TupleParts<T>["suffix"], RemainingOptional, true>, TupleParts<T>["suffix"]> : never : never;
type DropFixedTuple<T, N, IncludePrefixes = false, Dropped extends Array<unknown> = []> = Dropped["length"] extends N ? T : T extends readonly [unknown, ...infer Rest] ? DropFixedTuple<Rest, N, IncludePrefixes, [...Dropped, unknown]> | (true extends IncludePrefixes ? T : never) : [];
/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function drop<T extends IterableContainer, N extends number>(array: T, n: N): Drop<T, N>;
/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function drop<N extends number>(n: N): <T extends IterableContainer>(array: T) => Drop<T, N>;
//#endregion
export { drop as t };
//# sourceMappingURL=drop-B4j6hFj3.d.ts.map