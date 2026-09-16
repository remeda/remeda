import type { LazyEvaluator } from "./types/LazyEvaluator";
import type {
  LazyControl,
  LazyLast,
  LazyMany,
  LazySkip,
  LazyStop,
} from "./types/LazyResult";
import type { StrictFunction } from "./types/StrictFunction";

// A `Symbol()` (never `Symbol.for`) that never leaves the package, so no value
// that enters a pipe can carry the brand, whatever its origin.
export const LAZY_CONTROL: unique symbol = Symbol("remeda.lazyControl");

// Every control literal lists the same five keys in the same order so that V8
// gives them all a single hidden class, keeping the reads in `pipe`
// monomorphic.

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM: LazySkip = {
  [LAZY_CONTROL]: true,
  done: false,
  hasNext: false,
  hasMany: false,
  next: undefined,
};

const STOP: LazyStop = {
  [LAZY_CONTROL]: true,
  done: true,
  hasNext: false,
  hasMany: false,
  next: undefined,
};

/**
 * A helper evaluator for stopping the pipe without emitting anything. Both the
 * result and the evaluator are shared singletons.
 */
export const lazyEmptyEvaluator = (): LazyStop => STOP;

/**
 * A helper evaluator that passes every item through unchanged.
 */
export const lazyIdentityEvaluator = <T>(value: T): T => value;

/**
 * Emits `next` and stops the pipe.
 */
export const doneWith = <T>(next: T): LazyLast<T> => ({
  [LAZY_CONTROL]: true,
  done: true,
  hasNext: true,
  hasMany: false,
  next,
});

/**
 * Feeds every element of `next` through the rest of the pipe, one by one.
 */
export const manyItems = <T>(next: readonly T[]): LazyMany<T> => ({
  [LAZY_CONTROL]: true,
  done: false,
  hasNext: true,
  hasMany: true,
  next,
});

export const isLazyControl = (result: unknown): result is LazyControl =>
  // The `typeof` guard is required because `in` throws a `TypeError` when the
  // right operand is a primitive. The guard plus `in`, instead of reading the
  // brand off the result directly (which boxes every primitive item and
  // measured 2x-3.5x slower on number and string pipelines), is what keeps the
  // common pass-through case free.
  typeof result === "object" &&
  result !== null &&
  // eslint-disable-next-line unicorn/no-computed-property-existence-check -- The brand is an own symbol key so `in` is an inline-cached lookup on the per-item hot path; `Object.hasOwn` would add a builtin call for the same answer.
  LAZY_CONTROL in result;

const DATA_MARKER = { requiresData: true } as const;

/**
 * Marks an evaluator that reads `data` itself, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton such as `lazyIdentityEvaluator` or
 * `doneWith`.
 */
export const readsData = <T, R>(
  evaluator: LazyEvaluator<T, R>,
): LazyEvaluator<T, R> => Object.assign(evaluator, DATA_MARKER);

/**
 * Marks an evaluator as needing `data` only when the user's `callback` can
 * receive it positionally. `Function.length` is 0 only when the *first*
 * parameter is a rest parameter, which is what wrappers that forward
 * `arguments` (mocks, memoize, debounce) look like, and we can't see through
 * them, so those buffer too. Three holes are documented rather than guarded: a
 * default parameter before `data` (`(x, i = 0, data = []) => ...` reports 1),
 * `arguments[i]` access, and a trailing rest parameter
 * (`(value, index, ...rest) => ...` reports 2).
 */
export const readsDataWhen = <T, R>(
  callback: StrictFunction,
  dataParameterIndex: number,
  evaluator: NoInfer<LazyEvaluator<T, R>>,
): LazyEvaluator<T, R> =>
  callback.length === 0 || callback.length > dataParameterIndex
    ? readsData(evaluator)
    : evaluator;
