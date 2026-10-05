import type { LazyResult } from "../lazyControl";

/**
 * Providing an evaluator additional levers to control how `pipe` handles the
 * step.
 */
export type LazyEvaluatorMetadata = {
  /**
   * Some evaluators expect a `data` parameter which they provide to their
   * callback functions (e.g., `map`'s 3rd parameter); but managing this buffer
   * lazily requires extra work and memory, so it is only computed when
   * required, and otherwise replaced by `UNEXPECTED_ACCESS_SENTINEL`.
   *
   * @default false
   */
  readonly requiresData?: true;
};

export type LazyEvaluator<T = unknown, R = T> = ((
  item: T,
  index: number,
  data: readonly T[],
) => LazyResult<R>) &
  LazyEvaluatorMetadata;
