import type { LazyResult, LazySlot } from "../lazyControl";

// Declares the kinds of results an evaluator may return, which its result type
// alone can't: `LazyResult<unknown>` collapses to `unknown`, so without it an
// evaluator that can stop would be assignable to one that can't.
declare const BRAND_RESULT_KINDS: unique symbol;

/**
 * Extra levers an evaluator gives `pipe` over how it runs the step.
 */
type LazyEvaluatorMetadata = {
  /**
   * Some evaluators provide `data` to their callbacks (e.g., `map`'s 3rd
   * parameter). Collecting it lazily costs a buffer that grows with every
   * item, so the lazy runners (`pipe`, `iterableDataFirst`) only collect
   * it for evaluators marked with this flag and hand every other evaluator
   * `UNEXPECTED_ACCESS_SENTINEL` instead. Set it via `requireData` or
   * `requireDataByArity`, never directly.
   */
  readonly requiresData?: true;
};

export type BaseEvaluator<T, Result, ResultKinds extends string> = (((
  item: T,
  index: number,
  data: readonly T[],
  // Allows an evaluator to pass back data; The semantics of this data is
  // defined by the lazy controls.
  slot: LazySlot,
) => Result) &
  LazyEvaluatorMetadata) & {
  readonly [BRAND_RESULT_KINDS]?: ResultKinds;
};

export type LazyEvaluator<T = unknown, R = T> = BaseEvaluator<
  T,
  LazyResult<R>,
  "lazy"
>;
