import type { LazyResult } from "../pipe";

const EMPTY_PIPE = { done: true, hasNext: false } as const;

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM = { done: false, hasNext: false } as const;

/**
 * A helper evaluator when we want to return an empty result. It memoizes both
 * the result and the evaluator itself to reduce memory usage.
 */
export const lazyEmptyEvaluator = <T>(): LazyResult<T> => EMPTY_PIPE;

/**
 * A helper evaluator when we want to return a shallow clone of the input. It
 * memoizes both the evaluator itself to reduce memory usage.
 */
export const lazyIdentityEvaluator = <T>(value: T) =>
  ({
    hasNext: true,
    next: value,
    done: false,
  }) as const;
