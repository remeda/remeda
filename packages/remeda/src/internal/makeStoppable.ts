import type { StrictFunction } from "./types/StrictFunction";

export type StoppableMetadata = {
  readonly isStoppable: true;
};

/**
 * Marks a lazy implementation whose evaluators can stop the pipe early (they
 * return `STOP`, or a value through `lastLazyValue`). `pipe` fuses a run of
 * lazy functions only when one of them carries this mark: without one, every
 * item goes through every step anyway, so the functions run one after the
 * other on arrays, each through its data-first implementation. Type such
 * evaluators `StoppableLazyEvaluator`.
 *
 * @see StoppableLazyEvaluator
 */
export const makeStoppable = <Func extends StrictFunction>(
  fn: Func,
): Func & StoppableMetadata =>
  Object.assign(fn, { isStoppable: true } satisfies StoppableMetadata);
