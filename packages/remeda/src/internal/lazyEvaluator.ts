import type { LazyResult } from "./lazyControl";

/**
 * Handed to every step that doesn't read `data`. Frozen so a callback that
 * slips through the arity gate (default parameters, `arguments`) can't corrupt
 * a module-wide singleton.
 */
export const NO_DATA: readonly never[] = Object.freeze([]);

/**
 * Providing an evaluator additional levers to control how `pipe` handles the
 * step.
 */
export type LazyControlMetadata = {
  /**
   * Some evaluators expect a `data` parameter which they provide to their
   * callback functions (e.g., `map`'s 3rd parameter); but managing this buffer
   * lazily requires extra work and memory, so it is only computed when
   * required, and otherwise faked via a frozen sentinel.
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
  LazyControlMetadata;
