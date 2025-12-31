import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/zipWith.d.ts
type ZippingFunction<T1 extends IterableContainer = IterableContainer, T2 extends IterableContainer = IterableContainer, Value = unknown> = (first: T1[number], second: T2[number], index: number, data: readonly [first: T1, second: T2]) => Value;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a: string, b: string) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @category Array
 */
declare function zipWith<TItem1, TItem2, Value>(fn: ZippingFunction<ReadonlyArray<TItem1>, ReadonlyArray<TItem2>, Value>): (first: ReadonlyArray<TItem1>, second: ReadonlyArray<TItem2>) => Array<Value>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(second, fn)(first)
 * @example
 *   R.pipe(['1', '2', '3'], R.zipWith(['a', 'b', 'c'], (a, b) => a + b)) // => ['1a', '2b', '3c']
 * @dataLast
 * @lazy
 * @category Array
 */
declare function zipWith<T1 extends IterableContainer, T2 extends IterableContainer, Value>(second: T2, fn: ZippingFunction<T1, T2, Value>): (first: T1) => Array<Value>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(first, second, fn)
 * @example
 *   R.zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function zipWith<T1 extends IterableContainer, T2 extends IterableContainer, Value>(first: T1, second: T2, fn: ZippingFunction<T1, T2, Value>): Array<Value>;
//#endregion
export { zipWith as t };
//# sourceMappingURL=zipWith-CMEO3ehI.d.cts.map