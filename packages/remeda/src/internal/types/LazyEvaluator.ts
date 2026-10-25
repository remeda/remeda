import type { LazyResult, LazySlot, StoppableLazyResult } from "../lazyControl";

// Exists only in types. Tells the two kinds of evaluator apart where their
// result types can't: `LazyDefinition`'s `lazy` prop types its evaluator's
// result as `unknown`, which absorbs every control. The stoppable kind takes
// `boolean` because an evaluator that may stop doesn't have to, which makes
// every `LazyEvaluator` a `StoppableLazyEvaluator` too.
declare const stopsPipe: unique symbol;

export type LazyEvaluator<T = unknown, R = T> = BaseEvaluator<
  T,
  LazyResult<R>
> & {
  readonly [stopsPipe]?: false;
};

/**
 * An evaluator that can also use pipe short-circuiting controls to stop
 * pipe evaluations in the middle.
 *
 * @see makeStoppable
 */
export type StoppableLazyEvaluator<T = unknown, R = T> = BaseEvaluator<
  T,
  StoppableLazyResult<R>
> & {
  readonly [stopsPipe]?: boolean;
};

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

type BaseEvaluator<T, Result> = ((
  item: T,
  index: number,
  data: readonly T[],
  // Only evaluators that stop with a value or fan out need it, and only to
  // pass it to `lastLazyValue` or `manyLazyValues`.
  slot: LazySlot,
) => Result) &
  LazyEvaluatorMetadata;
