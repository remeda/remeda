import type { LazyResult } from "./LazyResult";

export type LazyEvaluator<T = unknown, R = T> = (
  item: T,
  index: number,
  data: ReadonlyArray<T>,
) => LazyResult<R>;
