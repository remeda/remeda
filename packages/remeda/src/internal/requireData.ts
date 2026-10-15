import type { LazyEvaluator } from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

// Most callbacks have the input `data` as their 3rd parameter, as in the
// standard library's array iteration methods (`map`, `filter`, `find`, ...).
const DEFAULT_DATA_PARAMETER_INDEX = 2;

type RequireDataByArityOptions = {
  /**
   * Callbacks with an extra parameter before the index have `data` one
   * position later: an accumulator (`mapWithFeedback`) or the second input's
   * item (`zipWith`).
   *
   * @see zipWith
   * @default 2
   */
  readonly dataParameterIndex?: number;
};

/**
 * Marks an evaluator that always needs `data`, because it reads it itself or
 * forwards it to a callback known to read it, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton or the user's callback itself.
 */
export const requireData = <T, R>(
  // `T` and `R` come only from the caller's declared `LazyEvaluator<T, R>`
  // return type, so a wrong evaluator is reported at its own return expression
  // instead of widening `R` and failing at the call.
  evaluator: NoInfer<LazyEvaluator<T, R>>,
): LazyEvaluator<T, R> => {
  // @ts-expect-error [ts2540] -- Intentional! we want to keep the prop
  // `readonly` to communicate that it shouldn't be mutated freely; this is the
  // only place where we allow it to be set!
  evaluator.requiresData = true;
  return evaluator;
};

/**
 * Marks an evaluator as needing `data` only when the user's `callback` is
 * likely to read it, based on its signature. It marks `evaluator` the way
 * `requireData` does, by mutating it, so callers must pass a freshly created
 * closure, never a module-level evaluator such as `lazyEmptyEvaluator`.
 *
 * @see canReadData
 * @see requireData
 */
export const requireDataByArity = <T, R>(
  callback: StrictFunction,
  evaluator: NoInfer<LazyEvaluator<T, R>>,
  {
    dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
  }: RequireDataByArityOptions = {},
): LazyEvaluator<T, R> =>
  canReadData(callback, dataParameterIndex)
    ? requireData(evaluator)
    : evaluator;

/**
 * Whether the user's `callback` is likely to read its `data` parameter, based
 * on its signature.
 *
 * Whenever our detection fails we provide the function with the sentinel
 * pseudo-array `UNEXPECTED_ACCESS_SENTINEL` which throws on almost any kind of
 * usage to signal as soon as possible that something went wrong.
 */
export const canReadData = (
  { length }: StrictFunction,
  dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
): boolean =>
  // `Function.length` counts only the plain parameters before the first rest
  // (e.g., 2 for `foo(a, b, ...c)`), or defaulted one (e.g., 1 for
  // `foo(a, b = 0)`); which means it is 0 both for callbacks that take no
  // parameters (e.g., `foo()`) which obviously won't read `data`, but *also*
  // in many cases which handle functions generically via a rest parameter
  // (e.g., `foo(...args)`) or that use `arguments` (e.g., `memoize`,
  // `debounce`) which *might* need data. To err on the safe side we consider
  // these cases as requiring data.
  length === 0 ||
  // For all other functions we assume that if the function *itself* declares a
  // parameter at the data parameter index, then it most likely wants to handle
  // it and we should provide it.
  // This does have its drawbacks due to the same issues mentioned above, if
  // the function uses default params, uses a rest element, or accesses the
  // data via the `arguments` keyword.
  length > dataParameterIndex;
