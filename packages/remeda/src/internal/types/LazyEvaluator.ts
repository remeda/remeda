import type { LazyResult, LazySlot } from "../lazyControl";

// `LazyEvaluatorFactory` checks evaluators with an `unknown` result, which
// absorbs `StoppableResult`, so the result type alone can't tell the two
// evaluator types apart there. The brand carries the kinds of results an
// evaluator was declared with, so a `StoppableLazyEvaluator` is only accepted
// together with the `makeStoppable` mark.
declare const BRAND_RESULT_KINDS: unique symbol;

/**
 * Extra levers an evaluator gives `pipe` over how it runs the step.
 */
type LazyEvaluatorMetadata = {
  /**
   * Some evaluators provide `data` to their callbacks (e.g., `map`'s 3rd
   * parameter). Collecting it lazily costs a buffer that grows with every
   * item, so the lazy runners (`pipe`, `processSingleLazyStep`) only collect
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
  // Only evaluators that stop with a value or fan out need it, and only to
  // pass it to `lastLazyValue` or `manyLazyValues`.
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
