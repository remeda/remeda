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

type TruncateOptions = {
  readonly omission?: string;
  readonly separator?: string | RegExp;
};

const DEFAULT_OMISSION = "...";

type Truncated<
  S extends string,
  N extends number,
  Options extends TruncateOptions = {},
> = TruncatedWithOptions<
  S,
  N,
  Options extends { omission: infer Omission }
    ? Omission
    : typeof DEFAULT_OMISSION,
  Options extends { separator: infer Separator } ? Separator : undefined
>;

type TruncatedWithOptions<
  S extends string,
  N extends number,
  Omission extends string,
  Separator extends string | RegExp | undefined,
> = If<
  IsStringLiteral<Omission>,
  If<
    IsEqual<ClampedIntegerSubtract<N, StringLength<Omission>>, 0>,
    TruncateLiterals<Omission, N, "">,
    If<
      And<IsStringLiteral<S>, IsEqual<Separator, undefined>>,
      TruncateLiterals<
        S,
        ClampedIntegerSubtract<N, StringLength<Omission>>,
        Omission
      >,
      string
    >
  >,
  string
>;

type TruncateLiterals<
  S extends string,
  N extends number,
  Omission extends string,
  Characters extends ReadonlyArray<string> = [],
> = S extends `${infer Character}${infer Rest}`
  ? Characters["length"] extends N
    ? `${Join<Characters, "">}${Omission}`
    : TruncateLiterals<Rest, N, Omission, [...Characters, Character]>
  : Join<Characters, "">;

type StringLength<
  S extends string,
  Characters extends ReadonlyArray<string> = [],
> = S extends `${infer Character}${infer Rest}`
  ? StringLength<Rest, [...Characters, Character]>
  : Characters["length"];

export function truncate<
  S extends string,
  N extends number,
  Options extends TruncateOptions = {},
>(
  data: S,
  n: NonNegativeInteger<N>,
  options?: Options,
): Truncated<S, N, Options>;
export function truncate(
  data: string,
  n: number,
  options?: TruncateOptions,
): string;
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
