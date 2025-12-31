import { t as ClampedIntegerSubtract } from "./ClampedIntegerSubtract-RjA0M8T2.js";
import { And, IsEqual, IsNever, IsStringLiteral, NonNegativeInteger } from "type-fest";

//#region src/internal/types/StringLength.d.ts

/**
 * Returns a literal number for literal strings.
 *
 * Although TypeScript provides literal length for tuples via the `length`
 * property, it doesn't do so for strings.
 */
type StringLength<S extends string, Characters extends ReadonlyArray<string> = []> = IsStringLiteral<S> extends true ? S extends `${infer Character}${infer Rest}` ? StringLength<Rest, [...Characters, Character]> : Characters["length"] : number;
//#endregion
//#region src/truncate.d.ts
type TruncateOptions = {
  readonly omission?: string;
  readonly separator?: string | RegExp;
};
declare const DEFAULT_OMISSION = "...";
type Truncate<S extends string, N extends number, Options extends TruncateOptions> = IsNever<NonNegativeInteger<N>> extends true ? string : TruncateWithOptions<S, N, Options extends Pick<Required<TruncateOptions>, "omission"> ? Options["omission"] : typeof DEFAULT_OMISSION, Options extends Pick<Required<TruncateOptions>, "separator"> ? Options["separator"] : undefined>;
type TruncateWithOptions<S extends string, N extends number, Omission extends string, Separator extends string | RegExp | undefined> = N extends unknown ? IsEqual<N, 0> extends true ? "" : Omission extends unknown ? IsStringLiteral<Omission> extends true ? IsEqual<ClampedIntegerSubtract<N, StringLength<Omission>>, 0> extends true ? TruncateLiterals<Omission, N, ""> : And<IsStringLiteral<S>, IsEqual<Separator, undefined>> extends true ? TruncateLiterals<S, N, Omission> : string : string : never : never;
/**
 * This is the actual implementation of the truncation logic. It assumes all
 * its params are literals and valid.
 */
type TruncateLiterals<S extends string, N extends number, Omission extends string, Iteration extends ReadonlyArray<unknown> = []> = S extends `${infer Character}${infer Rest}` ? Iteration["length"] extends ClampedIntegerSubtract<N, StringLength<Omission>> ? IsLongerThan<S, Omission> extends true ? Omission : S : `${Character}${TruncateLiterals<Rest, N, Omission, [...Iteration, unknown]>}` : "";
/**
 * An optimized check that efficiently checks if the string A is longer than B.
 */
type IsLongerThan<A extends string, B extends string> = A extends `${string}${infer RestA}` ? B extends `${string}${infer RestB}` ? IsLongerThan<RestA, RestB> : true : false;
/**
 * Truncates strings to a maximum length, adding an ellipsis when truncated.
 *
 * Shorter strings are returned unchanged. If the omission marker is longer than
 * the maximum length, it will be truncated as well.
 *
 * The `separator` argument provides more control by optimistically searching
 * for a matching cutoff point, which could be used to avoid truncating in the
 * middle of a word or other semantic boundary.
 *
 * If you just need to limit the total length of the string, without adding an
 * `omission` or optimizing the cutoff point via `separator`, prefer
 * `sliceString` instead, which runs more efficiently.
 *
 * The function counts Unicode characters, not visual graphemes, and may split
 * emojis, denormalized diacritics, or combining characters, in the middle. For
 * display purposes, prefer CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis)
 * which is locale-aware and purpose-built for this task.
 *
 * @param data - The input string.
 * @param n - The maximum length of the output string. The output will **never**
 * exceed this length.
 * @param options - An optional options object.
 * @param options.omission - The string that is appended to the end of the
 * output *whenever the input string is truncated*. Default: '...'.
 * @param options.separator - A string or regular expression that defines a
 * cutoff point for the truncation. If multiple cutoff points are found, the one
 * closest to `n` will be used, and if no cutoff point is found then the
 * function will fallback to the trivial cutoff point. Regular expressions are
 * also supported. Default: <none> (which is equivalent to `""` or the regular
 * expression `/./`).
 * @signature
 *   R.truncate(data, n, { omission, separator });
 * @example
 *   R.truncate("Hello, world!", 8); //=> "Hello..."
 *   R.truncate(
 *     "cat, dog, mouse",
 *     12,
 *     { omission: "__", separator: ","},
 *   ); //=> "cat, dog__"
 * @dataFirst
 * @category String
 */
declare function truncate<S extends string, N extends number, const Options extends TruncateOptions>(data: S, n: N, options?: Options): Truncate<S, N, Options>;
/**
 * Truncates strings to a maximum length, adding an ellipsis when truncated.
 *
 * Shorter strings are returned unchanged. If the omission marker is longer than
 * the maximum length, it will be truncated as well.
 *
 * The `separator` argument provides more control by optimistically searching
 * for a matching cutoff point, which could be used to avoid truncating in the
 * middle of a word or other semantic boundary.
 *
 * If you just need to limit the total length of the string, without adding an
 * `omission` or optimizing the cutoff point via `separator`, prefer
 * `sliceString` instead, which runs more efficiently.
 *
 * The function counts Unicode characters, not visual graphemes, and may split
 * emojis, denormalized diacritics, or combining characters, in the middle. For
 * display purposes, prefer CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis)
 * which is locale-aware and purpose-built for this task.
 *
 * @param n - The maximum length of the output string. The output will **never**
 * exceed this length.
 * @param options - An optional options object.
 * @param options.omission - The string that is appended to the end of the
 * output *whenever the input string is truncated*. Default: '...'.
 * @param options.separator - A string or regular expression that defines a
 * cutoff point for the truncation. If multiple cutoff points are found, the one
 * closest to `n` will be used, and if no cutoff point is found then the
 * function will fallback to the trivial cutoff point. Regular expressions are
 * also supported. Default: <none> (which is equivalent to `""` or the regular
 * expression `/./`).
 * @signature
 *   R.truncate(n, { omission, separator })(data);
 * @example
 *   R.pipe("Hello, world!" as const, R.truncate(8)); //=> "Hello..."
 *   R.pipe(
 *     "cat, dog, mouse" as const,
 *     R.truncate(12, { omission: "__", separator: ","}),
 *   ); //=> "cat, dog__"
 * @dataLast
 * @category String
 */
declare function truncate<N extends number, const Options extends TruncateOptions>(n: N, options?: Options): <S extends string>(data: S) => Truncate<S, N, Options>;
//#endregion
export { truncate as t };
//# sourceMappingURL=truncate-ChVv5Ygc.d.ts.map