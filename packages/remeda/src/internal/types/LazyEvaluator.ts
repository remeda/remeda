import type { LazyResult } from "./LazyResult";

export type LazyEvaluator<T = unknown, R = T> = ((
  item: T,
  index: number,
  data: readonly T[],
) => LazyResult<R>) & {
  /**
   * When set, `pipe` maintains the buffer of items this step has seen so far
   * and passes it as `data`; otherwise `data` is a shared, frozen, empty array.
   */
  readonly requiresData?: true;
};
