import type { StrictFunction } from "./types/StrictFunction";

export type ReducingMetadata = {
  readonly isReducing: true;
};

/**
 * Reducing evaluators generate a single value (and not a stream of values). The
 * executor is expected to pull the first value out out the output instead of
 * returning the wrapping array/stream.
 */
export const makeReducing = <Func extends StrictFunction>(fn: Func): Func =>
  Object.assign(fn, { isReducing: true } satisfies ReducingMetadata);
