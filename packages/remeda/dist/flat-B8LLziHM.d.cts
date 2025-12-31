import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { IsNumericLiteral } from "type-fest";

//#region src/flat.d.ts
type FlatArray<T, Depth extends number, Iteration extends ReadonlyArray<unknown> = []> = Depth extends Iteration["length"] ? T : T extends readonly [] ? [] : T extends readonly [infer Item, ...infer Rest] ? [...(Item extends IterableContainer ? FlatArray<Item, Depth, [...Iteration, unknown]> : [Item]), ...FlatArray<Rest, Depth, Iteration>] : Array<FlatSimpleArrayItems<T, Depth, Iteration>>;
type FlatSimpleArrayItems<T, Depth extends number, Iteration extends ReadonlyArray<unknown> = [], IsDone extends boolean = false> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr> ? FlatSimpleArrayItems<InnerArr, Depth, [...Iteration, unknown], Iteration["length"] extends Depth ? true : false> : T;
}[IsDone extends true ? "done" : "recur"];
/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param data - The items to flatten.
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1. Non literal values (those typed as
 * `number`cannot be used. `Infinity`, `Number.POSITIVE_INFINITY` and
 * `Number.MAX_VALUE` are all typed as `number` and can't be used either. For
 * "unlimited" depth use a literal value that would exceed your expected
 * practical maximum nesting level.
 * @signature
 *   R.flat(data)
 *   R.flat(data, depth)
 * @example
 *   R.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
 *   R.flat([[[1]], [[2]]], 2); // => [1, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function flat<T extends IterableContainer, Depth extends number = 1>(data: T, depth?: IsNumericLiteral<Depth> extends true ? Depth : never): FlatArray<T, Depth>;
/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1.
 * @signature
 *   R.flat()(data)
 *   R.flat(depth)(data)
 * @example
 *   R.pipe([[1, 2], [3, 4], [5], [[6]]], R.flat()); // => [1, 2, 3, 4, 5, [6]]
 *   R.pipe([[[1]], [[2]]], R.flat(2)); // => [1, 2]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function flat<Depth extends number = 1>(depth?: IsNumericLiteral<Depth> extends true ? Depth : never): <T extends IterableContainer>(data: T) => FlatArray<T, Depth>;
//#endregion
export { flat as t };
//# sourceMappingURL=flat-B8LLziHM.d.cts.map