import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";

//#region src/zip.d.ts
type Zipped<Left extends IterableContainer, Right extends IterableContainer> = Left extends readonly [] ? [] : Right extends readonly [] ? [] : Left extends readonly [infer LeftHead, ...infer LeftRest] ? Right extends readonly [infer RightHead, ...infer RightRest] ? [[LeftHead, RightHead], ...Zipped<LeftRest, RightRest>] : [[LeftHead, Right[number]], ...Zipped<LeftRest, Right>] : Right extends readonly [infer RightHead, ...infer RightRest] ? [[Left[number], RightHead], ...Zipped<Left, RightRest>] : Array<[Left[number], Right[number]]>;
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function zip<F extends IterableContainer, S extends IterableContainer>(first: F, second: S): Zipped<F, S>;
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param second - The second input list.
 * @signature
 *   R.zip(second)(first)
 * @example
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function zip<S extends IterableContainer>(second: S): <F extends IterableContainer>(first: F) => Zipped<F, S>;
//#endregion
export { zip as t };
//# sourceMappingURL=zip-n4GTgv2t.d.ts.map