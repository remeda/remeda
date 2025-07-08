import type {
  And,
  IsEqual,
  IsStringLiteral,
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
  Options extends TruncateOptions,
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
  // Distribute the result over unions.
  N extends unknown
    ? If<
        // We can short-circuit most of our logic when N is a literal 0.
        IsEqual<N, 0>,
        "",
        // Distribute the result over unions.
        Omission extends unknown
          ? If<
              // When Omission isn't literal we don't know how long it is.
              IsStringLiteral<Omission>,
              If<
                // This mirrors the runtime logic where if `n - omission.length`
                // is not positive then what we end up truncating is Omission
                // itself and not S.
                IsEqual<ClampedIntegerSubtract<N, StringLength<Omission>>, 0>,
                TruncateLiterals<Omission, N, "">,
                If<
                  And<
                    // When S isn't literal the output wouldn't be literal
                    // either.
                    IsStringLiteral<S>,
                    // TODO: Handling non-trivial separators would add a tonne of complexity to this type! It's possible (but hard!) to support string literals so i'm leaving this as a TODO; regular expressions are impossible because we can't get the type checker to run them.
                    IsEqual<Separator, undefined>
                  >,
                  TruncateLiterals<S, N, Omission>,
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
  Iteration extends ReadonlyArray<unknown> = [],
> = S extends `${infer Character}${infer Rest}`
  ? // The cutoff point N - omission.length leaves room for the omission.
    Iteration["length"] extends ClampedIntegerSubtract<
      N,
      StringLength<Omission>
    >
    ? // The string is only truncated if it's total length is longer than N; at
      // the cutoff point this is simplified to comparing the remaining suffix
      // length to the omission length.
      If<IsLongerThan<S, Omission>, Omission, S>
    : // Reconstruct string character by character until cutoff.
      `${Character}${TruncateLiterals<Rest, N, Omission, [...Iteration, unknown]>}`
  : // Empty input string results in empty output.
    "";

/**
 * An optimized check that efficiently checks if the string A is longer than B.
 */
type IsLongerThan<
  A extends string,
  B extends string,
> = A extends `${string}${infer RestA}`
  ? B extends `${string}${infer RestB}`
    ? IsLongerThan<RestA, RestB>
    : // B is empty and A isn't!
      true
  : // A is empty, even if B is empty, A wouldn't be (strictly) longer.
    false;

/**
 * Truncates strings longer than `n`, appending an `omission` marker to them
 * (which defaults to '...'); shorter strings are returned as-is. The total
 * length of the output will never exceed `n` (in the rare case where the
 * `omission` itself is too long, it will be truncated too).
 *
 * The `separator` argument provides more control by optimistically searching
 * for a matching cutoff point, which could be used to avoid truncating in the
 * middle of a word or other semantic boundary.
 *
 * If you just need to limit the total length of the string, without adding an
 * `omission` or optimizing the cutoff point via `separator`, prefer
 * `sliceString` instead, which runs more efficiently.
 *
 * **IMPORTANT**: Prefer using CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis) when
 * the output is rendered in a browser; this function doesn't handle
 * diacritics, emojis, and any sort of semantic understanding of the string
 * contents.
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
export function truncate<
  S extends string,
  N extends number,
  const Options extends TruncateOptions,
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
 * Truncates strings longer than `n`, appending an `omission` marker to them
 * (which defaults to '...'); shorter strings are returned as-is. The total
 * length of the output will never exceed `n` (in the rare case where the
 * `omission` itself is too long, it will be truncated too).
 *
 * The `separator` argument provides more control by optimistically searching
 * for a matching cutoff point, which could be used to avoid truncating in the
 * middle of a word or other semantic boundary.
 *
 * If you just need to limit the total length of the string, without adding an
 * `omission` or optimizing the cutoff point via `separator`, prefer
 * `sliceString` instead, which runs more efficiently.
 *
 * **IMPORTANT**: Prefer using CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis) when
 * the output is rendered in a browser; this function doesn't handle
 * diacritics, emojis, and any sort of semantic understanding of the string
 * contents.
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
export function truncate<
  N extends number,
  const Options extends TruncateOptions,
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
    const globalSeparator = separator.flags.includes("g")
      ? separator
      : new RegExp(separator.source, `${separator.flags}g`);

    let lastSeparator;
    for (const { index } of data.matchAll(globalSeparator)) {
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
