import type { StoppableLazyEvaluator } from "./makeStoppable";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * Marks an evaluator that always needs `data`, because it reads it itself or
 * forwards it to a callback known to read it, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton or the user's callback itself.
 */
export const requireData = <
  // Every `LazyEvaluator` is also a `StoppableLazyEvaluator`, so this accepts
  // any evaluator.
  Evaluator extends StoppableLazyEvaluator<never, unknown>,
>(
  // `Evaluator` comes only from the evaluator type the caller declares (e.g.,
  // as the lazy implementation's return type), so a wrong evaluator is
  // reported at its own return expression instead of being inferred from it
  // and failing at the call. Without a declared type it falls back to its
  // constraint, whose `never` items no lazy implementation accepts, or, in a
  // lazy implementation written inline as an argument, to the
  // `StoppableLazyEvaluator` its context expects, which needs the
  // `makeStoppable` mark.
  evaluator: NoInfer<Evaluator>,
): Evaluator => {
  // @ts-expect-error [ts2540] -- Intentional! we want to keep the prop
  // `readonly` to communicate that it shouldn't be mutated freely; this is the
  // only place where we allow it to be set!
  evaluator.requiresData = true;
  return evaluator;
};

/**
 * Marks an evaluator as needing `data` only when the user's `callback` is
 * likely to read it, based on its signature.
 *
 * @param callback - The user's callback, whose signature decides whether
 * `data` is needed.
 * @param dataParameterIndex - Which positional argument in the callback takes
 * the accumulated `data` array. For most functions that would be *2* (after
 * the `item` argument in position 0, and the `index` argument in position 1).
 * @param evaluator - The evaluator to mark. It is marked the way `requireData`
 * does, by mutating it, so callers must pass a freshly created closure, never a
 * module-level evaluator such as `LAZY_EMPTY_EVALUATOR`.
 * @returns `evaluator` itself, marked as needing `data` when `callback` is
 * likely to read it.
 * @see canReadData
 * @see requireData
 */
export const requireDataByArity = <
  Evaluator extends StoppableLazyEvaluator<never, unknown>,
>(
  callback: StrictFunction,
  dataParameterIndex: number,
  evaluator: NoInfer<Evaluator>,
): Evaluator =>
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
  dataParameterIndex: number,
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
