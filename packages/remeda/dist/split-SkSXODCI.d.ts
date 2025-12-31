import { ArraySlice, IsFloat, NonNegative, Split } from "type-fest";

//#region src/split.d.ts
type BuiltInReturnType = ReturnType<typeof String.prototype.split>;
type Split$1<S extends string, Separator extends string, N extends number | undefined = undefined> = string extends S ? BuiltInReturnType : string extends Separator ? BuiltInReturnType : number extends N ? BuiltInReturnType : IsFloat<N> extends true ? BuiltInReturnType : N extends number ? ArraySlice<Split<S, Separator>, 0, NonNegative<N>> : Split<S, Separator>;
/**
 * Splits a string into an array of substrings using a separator pattern.
 *
 * This function is a wrapper around the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * method.
 *
 * @param data - The string to split.
 * @param separator - The pattern describing where each split should occur. Can
 * be a string, or a regular expression.
 * @param limit - A non-negative integer specifying a limit on the number of
 * substrings to be included in the array. If provided, splits the string at
 * each occurrence of the specified separator, but stops when limit entries have
 * been placed in the array. Any leftover text is not included in the array at
 * all. The array may contain fewer entries than limit if the end of the string
 * is reached before the limit is reached. If limit is 0, [] is returned.
 * @returns An array of strings, split at each point where the separator occurs
 * in the given string.
 * @signature
 *   R.split(data, separator, limit);
 * @example
 *   R.split("a,b,c", ","); //=> ["a", "b", "c"]
 *   R.split("a,b,c", ",", 2); //=> ["a", "b"]
 *   R.split("a1b2c3d", /\d/u); //=> ["a", "b", "c", "d"]
 * @dataFirst
 * @category String
 */
declare function split(data: string, separator: RegExp, limit?: number): Array<string>;
declare function split<S extends string, Separator extends string, N extends number | undefined = undefined>(data: S, separator: Separator, limit?: N): Split$1<S, Separator, N>;
/**
 * Splits a string into an array of substrings using a separator pattern.
 *
 * This function is a wrapper around the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * method.
 *
 * @param separator - The pattern describing where each split should occur. Can
 * be a string, or a regular expression.
 * @param limit - A non-negative integer specifying a limit on the number of
 * substrings to be included in the array. If provided, splits the string at
 * each occurrence of the specified separator, but stops when limit entries have
 * been placed in the array. Any leftover text is not included in the array at
 * all. The array may contain fewer entries than limit if the end of the string
 * is reached before the limit is reached. If limit is 0, [] is returned.
 * @returns An array of strings, split at each point where the separator occurs
 * in the given string.
 * @signature
 *   R.split(separator, limit)(data);
 * @example
 *   R.pipe("a,b,c", R.split(",")); //=> ["a", "b", "c"]
 *   R.pipe("a,b,c", R.split(",", 2)); //=> ["a", "b"]
 *   R.pipe("a1b2c3d", R.split(/\d/u)); //=> ["a", "b", "c", "d"]
 * @dataLast
 * @category String
 */
declare function split(separator: RegExp, limit?: number): (data: string) => Array<string>;
declare function split<S extends string, Separator extends string, N extends number | undefined = undefined>(separator: Separator, limit?: N): (data: S) => Split$1<S, Separator, N>;
//#endregion
export { split as t };
//# sourceMappingURL=split-SkSXODCI.d.ts.map