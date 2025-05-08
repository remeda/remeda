import type { Tagged } from "type-fest";

/* v8 ignore next 2 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for RemedaTypeError
const RemedaErrorSymbol = Symbol("RemedaError");

/**
 * Used for reporting type errors in a more useful way than `never`. Use
 * numbers for things that should never happen.
 */
export type RemedaTypeError<
  FunctionName extends string,
  Message extends string | number,
  Metadata = never,
> = Message extends string
  ? Tagged<
      typeof RemedaErrorSymbol,
      `RemedaTypeError(${FunctionName}): ${Message}.`,
      Metadata
    >
  : RemedaTypeError<
      FunctionName,
      `Internal error ${Message}. Please open a Remeda GitHub issue.`,
      Metadata
    >;
