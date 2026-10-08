import type { LazyEvaluator } from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

// Most callbacks have the input `data` as their 3rd parameter, as in all the
// standard library functions.
const DEFAULT_DATA_PARAMETER_INDEX = 2;

type RequireDataByArityOptions = {
  /**
   * Some special functions have their `data` parameter in a different
   * position, mostly when they process more than a single input array.
   *
   * @see zipWith
   * @default 2
   */
  readonly dataParameterIndex?: number;
};

/**
 * Marks an evaluator that reads `data` itself, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton or the user's callback itself.
 */
export const requireData = <T, R>(
  // In both helpers, `T` and `R` come only from the caller's declared
  // `LazyEvaluator<T, R>` return type, so a wrong evaluator is reported at its
  // own return expression instead of widening `R` and failing at the call.
  evaluator: NoInfer<LazyEvaluator<T, R>>,
): LazyEvaluator<T, R> => {
  // @ts-expect-error [ts2540] -- The marker is read-only so that evaluators can't set it on themselves; this helper is the one place that does.
  evaluator.requiresData = true;
  return evaluator;
};

/**
 * Marks an evaluator as needing `data` only when the user's `callback` is
 * likely to read it, based on its signature.
 *
 * `Function.length` counts only the plain parameters before the first rest or
 * defaulted one. It is 0 for wrappers that forward `arguments` (memoize,
 * debounce), which we can't see through, so those buffer too.
 *
 * Three holes are documented rather than guarded: a default value on `data` or
 * any parameter before it (`(value, index, data = []) => ...` reports 2),
 * `arguments[i]` access, and a trailing rest parameter
 * (`(value, index, ...rest) => ...` reports 2).
 * A callback that falls through one of them receives
 * `UNEXPECTED_ACCESS_SENTINEL`, which throws when read.
 */
export const requireDataByArity = <T, R>(
  callback: StrictFunction,
  evaluator: NoInfer<LazyEvaluator<T, R>>,
  {
    dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
  }: RequireDataByArityOptions = {},
): LazyEvaluator<T, R> =>
  callback.length === 0 || callback.length > dataParameterIndex
    ? requireData(evaluator)
    : evaluator;
