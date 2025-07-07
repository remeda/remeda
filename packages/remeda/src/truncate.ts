/* eslint-disable @typescript-eslint/no-empty-object-type */

import type {
  And,
  IsEqual,
  IsStringLiteral,
  Join,
  NonNegativeInteger,
} from "type-fest";
import type { ClampedIntegerSubtract } from "./internal/types/ClampedIntegerSubtract";
import type { If } from "./internal/types/If";
import type { StringLength } from "./internal/types/StringLength";

type TruncateOptions = {
  readonly omission?: string;
  readonly separator?: string | RegExp;
};

const DEFAULT_OMISSION = "...";

type Truncate<
  S extends string,
  N extends number,
  Options extends TruncateOptions = {},
> = TruncateWithOptions<
  S,
  N,
  // TODO: I don't like how I handled the default options object; i want to have everything coupled between the runtime and the type system, but this feels both brittle to changes, and over-verbose.
  Options extends Pick<Required<TruncateOptions>, "omission">
    ? Options["omission"]
    : typeof DEFAULT_OMISSION,
  Options extends Pick<Required<TruncateOptions>, "separator">
    ? Options["separator"]
    : undefined
>;

type TruncateWithOptions<
  S extends string,
  N extends number,
  Omission extends string,
  Separator extends string | RegExp | undefined,
> =
  // When multiple values of `n` are provided we need to distribute the logic
  // over each one as they would each produce a different output.
  N extends unknown
    ? If<
        // We can short-circuit most of our logic when N is a literal 0, the
        // only output truncate would ever return in this case is an empty
        // string.
        IsEqual<N, 0>,
        "",
        // It's rare that `omission` wouldn't be defined as a string literal,
        // but if it's defined a union we need to distribute the logic over all
        // possible values to get the correct output.
        Omission extends unknown
          ? If<
              // When Omission isn't literal we don't know how long it is, so we
              // can't say how the output would be shaped. Ideally this would
              // be all prefixes of S up to N, with a suffix of `string`, but
              // that type is neither useful nor easy to compute.
              IsStringLiteral<Omission>,
              If<
                // This mirrors the runtime logic where if `n - omission.length`
                // is not positive then what we end up truncating is the
                // Omission itself and not S.
                IsEqual<ClampedIntegerSubtract<N, StringLength<Omission>>, 0>,
                TruncateLiterals<Omission, N, "">,
                If<
                  And<
                    // We can only compute a literal output when the input is
                    // literal because we know how long it is.
                    IsStringLiteral<S>,
                    // TODO: Handling non-trivial separators would add a tonne of complexity to this type! It's possible (but hard!) to support string literals so i'm leaving this as a TODO; regular expressions are impossible because we can't get the type checker to run them.
                    IsEqual<Separator, undefined>
                  >,
                  TruncateLiterals<
                    S,
                    // We "fix" N so that it takes into account the length of
                    // the omission.
                    ClampedIntegerSubtract<N, StringLength<Omission>>,
                    Omission
                  >,
                  string
                >
              >,
              string
            >
          : never
      >
    : never;

/**
 * This is the actual implementation of the truncation logic. It assumes all
 * its params are literals and valid.
 */
type TruncateLiterals<
  S extends string,
  N extends number,
  Omission extends string,
  Characters extends ReadonlyArray<string> = [],
> = S extends `${infer Character}${infer Rest}`
  ? // The order of the conditions here is important! The condition above is
    // satisfied only when the string isn't empty. When the condition below is
    // also satisfied it would mean that we found the cutoff point for the
    // string and we know it was truncated.
    Characters["length"] extends N
    ? `${Join<Characters, "">}${Omission}`
    : TruncateLiterals<Rest, N, Omission, [...Characters, Character]>
  : // We reach this point only if the string "emptied out" before we processed
    // N characters. This would mean it is shorter than N so we don't need to
    // add the omission.
    Join<Characters, "">;

/**
 * Ensure that a string never exceeds the maximum length defined by `n`. When a
 * string is longer, it will be truncated and the `omission` string will be
 * appended to the end of the string, so that the total length of the string
 * (including the `omission`) is at most `n`.
 *
 * In rare cases where `n` is less then the lenght of the `omission`,
 * `omission` itself will be truncated instead.
 *
 * The function also takes an optional `separator` argument which defines an
 * earlier cutoff point for the truncation which could be used to maintain
 * word boundaries or other semantic boundaries in the string.
 *
 * IMPORTANT: If the truncation is aimed at a UI that is rendered by a browser,
 * prefer using CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis)
 * instead. You should avoid handling rendering concerns in runtime code. This
 * function doesn't handle diacritics, emojis, and any sort of semantic
 * understanding of the string contents.
 *
 * If you don't need the special handling of the `omission` and `separator`
 * logic consider using `sliceString` instead.
 *
 * @param data - The string to truncate.
 * @param n - The maximum length of the output string. The output will **never**
 * exceed this length.
 * @param options - An optional options object.
 * @param options.omission - The string that is appended to the end of the
 * output *whenever the input string is truncated*. Default: '...'.
 * @param options.separator - A string or regular expression that defines a
 * cutoff point for the truncation. If multiple cutoff points are found, the one
 * closest to `n` will be used, and if no cutoff point is found then the
 * function will fallback to the trivial cutoff point. Regular expressions are
 * also supported, but they must have the [`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
 * flag. Default: <none> (which is equivalent to `""` and to the regular \
 * expression `/./gu`).
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
export function truncate<
  S extends string,
  N extends number,
  const Options extends TruncateOptions = {},
>(
  data: S,
  n: NonNegativeInteger<N>,
  options?: Options,
): Truncate<S, N, Options>;
export function truncate(
  data: string,
  n: number,
  options?: TruncateOptions,
): string;

/**
 * Ensure that a string never exceeds the maximum length defined by `n`. When a
 * string is longer, it will be truncated and the `omission` string will be
 * appended to the end of the string, so that the total length of the string
 * (including the `omission`) is at most `n`.
 *
 * In rare cases where `n` is less then the lenght of the `omission`,
 * `omission` itself will be truncated instead.
 *
 * The function also takes an optional `separator` argument which defines an
 * earlier cutoff point for the truncation which could be used to maintain
 * word boundaries or other semantic boundaries in the string.
 *
 * IMPORTANT: If the truncation is aimed at a UI that is rendered by a browser,
 * prefer using CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis)
 * instead. You should avoid handling rendering concerns in runtime code. This
 * function doesn't handle diacritics, emojis, and any sort of semantic
 * understanding of the string contents.
 *
 * If you don't need the special handling of the `omission` and `separator`
 * logic consider using `sliceString` instead.
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
 * also supported, but they must have the [`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
 * flag. Default: <none> (which is equivalent to `""` and to the regular \
 * expression `/./gu`).
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
export function truncate<
  N extends number,
  const Options extends TruncateOptions = {},
>(
  n: NonNegativeInteger<N>,
  options?: Options,
): <S extends string>(data: S) => Truncate<S, N, Options>;
export function truncate(
  n: number,
  options?: TruncateOptions,
): (data: string) => string;

export function truncate(
  dataOrN: string | number,
  nOrOptions?: number | TruncateOptions,
  options?: TruncateOptions,
): unknown {
  return typeof dataOrN === "string"
    ? truncateImplementation(
        dataOrN,
        // @ts-expect-error [ts2345] -- We want to reduce runtime checks to a
        // minimum, and there's no (easy) way to couple params so that when we
        // check one, the others are inferred accordingly.
        nOrOptions,
        options,
      )
    : (data: string) =>
        truncateImplementation(
          data,
          dataOrN,
          // @ts-expect-error [ts2345] -- We want to reduce runtime checks to a
          // minimum, and there's no (easy) way to couple params so that when we
          // check one, the others are inferred accordingly.
          nOrOptions,
        );
}

function truncateImplementation(
  data: string,
  n: number,
  { omission = DEFAULT_OMISSION, separator }: TruncateOptions = {},
): string {
  if (data.length <= n) {
    // No truncation needed.
    return data;
  }

  if (n <= 0) {
    // Avoid weirdness when n isn't positive.
    return "";
  }

  if (n < omission.length) {
    // Handle cases where the omission itself is too long.
    return omission.slice(0, n);
  }

  // Our trivial cutoff is the point where we can add the omission and reach
  // n exactly, this is what we'll use when no separator is provided.
  let cutoff = n - omission.length;

  if (typeof separator === "string") {
    const lastSeparator = data.lastIndexOf(separator, cutoff);
    if (lastSeparator !== -1) {
      // If we find the separator within the part of the string that would be
      // returned we move the cutoff further so that we also remove it.
      cutoff = lastSeparator;
    }
  } else if (separator !== undefined) {
    let lastSeparator;
    for (const { index } of data.matchAll(separator)) {
      if (index > cutoff) {
        // We only care about separators within the part of the string that
        // would be returned anyway, once we are past that point we don't care
        // about any further separators.
        break;
      }
      lastSeparator = index;
    }
    if (lastSeparator !== undefined) {
      cutoff = lastSeparator;
    }
  }

  // Build the output.
  return `${data.slice(0, cutoff)}${omission}`;
}
