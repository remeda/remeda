import type { LazyResult } from "./LazyResult";

export type LazyEvaluator<T = unknown, R = T> = (
  item: T,
  index: number,
  data: readonly T[],
) => LazyResult<R>;
