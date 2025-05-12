import type { Tagged } from "type-fest";

/**
 * Used for reporting type errors in a more useful way than `never`.
 */
export type RemedaTypeError<
  // Type errors don't have stack traces so we need good strings to be able to
  // grep for them and debug them.
  Name extends string,
  Message extends string,
  Metadata = never,
> = Tagged<never, `RemedaTypeError(${Name}): ${Message}.`, Metadata>;
