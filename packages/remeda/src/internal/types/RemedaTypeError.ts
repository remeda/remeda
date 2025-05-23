import type { Tagged } from "type-fest";

/* v8 ignore next 2 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for RemedaTypeError
const RemedaErrorSymbol = Symbol("RemedaError");

type RemedaTypeErrorOptions = {
  type?: unknown;
  metadata?: unknown;
};

/**
 * Used for reporting type errors in a more useful way than `never`.
 */
export type RemedaTypeError<
  // Type errors don't have stack traces so we need good strings to be able to
  // grep for them and debug them.
  Name extends string,
  Message extends string,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Options extends RemedaTypeErrorOptions = {},
> = Tagged<
  Options extends { type: infer T } ? T : typeof RemedaErrorSymbol,
  `RemedaTypeError(${Name}): ${Message}.`,
  Options extends { metadata: infer Metadata } ? Metadata : never
>;
