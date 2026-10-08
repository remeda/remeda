import type { LazyResult, LazySlot } from "../lazyControl";

/**
 * Extra levers an evaluator gives `pipe` over how it runs the step.
 */
export type LazyEvaluatorMetadata = {
  /**
   * Some evaluators provide `data` to their callbacks (e.g., `map`'s 3rd
   * parameter). Collecting it lazily costs a buffer that grows with every
   * item, so `pipe` only collects it for evaluators marked with this flag and
   * hands every other evaluator `UNEXPECTED_ACCESS_SENTINEL` instead. Set it
   * via `requireData` or `requireDataByArity`, never directly.
   */
  readonly requiresData?: true;
};

export type LazyEvaluator<T = unknown, R = T> = ((
  item: T,
  index: number,
  data: readonly T[],
  // Only evaluators that stop with a value or fan out need it, and only to
  // pass it to `lastLazyValue` or `manyLazyValues`.
  slot: LazySlot,
) => LazyResult<R>) &
  LazyEvaluatorMetadata;
