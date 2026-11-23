import type { LazyResult, LazySlot } from "./lazyControl";

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
   * item, so the lazy runners (`runFusedSequence`, `iterableDataFirst`) only
   * provide it to evaluators marked with this flag, and hand every other
   * evaluator `UNEXPECTED_ACCESS_SENTINEL` instead. The first step of a fused
   * sequence on an array gets the input array itself; every other step gets
   * the items collected so far. Either way `data` holds every item up to
   * `index`, and might hold more, so an evaluator reading it can't reliably
   * access indices beyond the current index.
   *
   *! **IMPORTANT**! Prefer enabling this option via `requireData` and `requireDataByArity` and not by manually setting it!
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
