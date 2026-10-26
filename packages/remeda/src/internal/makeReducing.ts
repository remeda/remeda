import type { StrictFunction } from "./types/StrictFunction";

export type ReducingMetadata = {
  readonly isReducing: true;
};

export const makeReducing = <Func extends StrictFunction>(fn: Func): Func =>
  Object.assign(fn, { isReducing: true } satisfies ReducingMetadata);
