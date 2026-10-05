import type { LazyControlMetadata, LazyEvaluator } from "./lazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

type ReadDataWhenOptions = {
  readonly dataParameterIndex?: number;
};

const DEFAULT_DATA_PARAMETER_INDEX = 2;

/**
 * Marks an evaluator that reads `data` itself, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton such as `lazyIdentityEvaluator` or
 * `doneWith`.
 */
export const readsData = <T, R>(
  evaluator: LazyEvaluator<T, R>,
): LazyEvaluator<T, R> =>
  Object.assign(evaluator, {
    requiresData: true,
  } satisfies LazyControlMetadata);

/**
 * Marks an evaluator as needing `data` only when the user's `callback` can
 * receive it positionally. `Function.length` is 0 only when the *first*
 * parameter is a rest parameter, which is what wrappers that forward
 * `arguments` (mocks, memoize, debounce) look like, and we can't see through
 * them, so those buffer too. Three holes are documented rather than guarded: a
 * default parameter before `data` (`(x, i = 0, data = []) => ...` reports 1),
 * `arguments[i]` access, and a trailing rest parameter
 * (`(value, index, ...rest) => ...` reports 2). A callback that falls through
 * one of them receives `UNEXPECTED_ACCESS_SENTINEL`, which throws when read.
 */
export const readsDataWhen = <T, R>(
  callback: StrictFunction,
  evaluator: NoInfer<LazyEvaluator<T, R>>,
  {
    dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
  }: ReadDataWhenOptions = {},
): LazyEvaluator<T, R> =>
  callback.length === 0 || callback.length > dataParameterIndex
    ? readsData(evaluator)
    : evaluator;
