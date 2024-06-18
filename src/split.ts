import type {
  ArraySlice,
  IsFloat,
  NonNegative,
  Split as SplitBase,
} from "type-fest";

type Split<
  S extends string,
  Separator extends string,
  N extends number | undefined = undefined,
> = string extends S
  ? Array<string>
  : string extends Separator
    ? Array<string>
    : number extends N
      ? Array<string>
      : // TODO: We need a way to "floor" non-integer numbers, until then we return a lower fidelity type instead.
        IsFloat<N> extends true
        ? Array<string>
        : ArraySlice<
            // We can use the base (type-fest) split **only** if all the params
            // are literals. For all other cases it would return the wrong type
            // so we fallback to the built-in Array.prototype.split return type.
            SplitBase<S, Separator>,
            0,
            // `undefined` and negative numbers are treated as non-limited
            // splits, which is what we'd get when using `never` for ArraySlice.
            N extends number ? NonNegative<N> : never
          >;

/**
 * Takes a pattern and divides this string into an ordered list of substrings by
 * searching for the pattern, puts these substrings into an array, and returns
 * the array. This function mirrors the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
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
 * @returns An Array of strings, split at each point where the separator occurs
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
export function split(
  data: string,
  separator: RegExp,
  limit?: number,
): Array<string>;
export function split<
  S extends string,
  Separator extends string,
  N extends number | undefined = undefined,
>(data: S, separator: Separator, limit?: N): Split<S, Separator, N>;

/**
 * Takes a pattern and divides this string into an ordered list of substrings by
 * searching for the pattern, puts these substrings into an array, and returns
 * the array. This function mirrors the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
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
 * @returns An Array of strings, split at each point where the separator occurs
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
export function split(
  separator: RegExp,
  limit?: number,
): (data: string) => Array<string>;
export function split<
  S extends string,
  Separator extends string,
  N extends number | undefined = undefined,
>(separator: Separator, limit?: N): (data: S) => Split<S, Separator, N>;

export function split(
  dataOrSeparator: RegExp | string,
  separatorOrLimit?: RegExp | number | string,
  limit?: number,
): unknown {
  return typeof separatorOrLimit === "number" || separatorOrLimit === undefined
    ? // dataLast
      (data: string) => data.split(dataOrSeparator, separatorOrLimit)
    : // dataFirst
      (dataOrSeparator as string).split(separatorOrLimit, limit);
}
