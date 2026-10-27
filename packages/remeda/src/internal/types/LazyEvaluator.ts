import type { LazyResult, LazySlot } from "../lazyControl";

// Allows an evaluator to declare it's return types explicitly, avoiding types
// collapsing to `unknown` due to the raw T in LazyResult eagerly resolving to
// `unknown`.
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
