import type { StrictFunction } from "./types/StrictFunction";

export type ReducingMetadata = {
  readonly isReducing: true;
};

/**
 * Marks a lazy implementation whose evaluator reduces the items to a single
 * value (e.g., `first`). `pipe` ends the lazy run after this step and unwraps
 * the run's output to its first item. Ending the iteration once the value is
 * found is the evaluator's job (`makeStoppable`).
 */
export const makeReducing = <Func extends StrictFunction>(fn: Func): Func =>
  Object.assign(fn, { isReducing: true } satisfies ReducingMetadata);
