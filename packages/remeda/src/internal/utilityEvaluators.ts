import {
  LAZY_REF,
  type LazyLast,
  type LazyMany,
  type LazySkip,
} from "./lazyControl";
import type { LazyControlMetadata, LazyEvaluator } from "./lazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM: LazySkip = {
  $$remedaLazyRef: LAZY_REF,
  control: "skip",
  isDone: false,
};

const STOP: LazySkip = {
  // The order of props is kept in sync with `SKIP_ITEM` so that v8 can build a
  // single hidden class for both; keeping the reads inside `pipe` monomorphic.
  $$remedaLazyRef: LAZY_REF,
  control: "skip",
  isDone: true,
};

/**
 * A helper evaluator that passes every item through unchanged.
 */
export const lazyIdentityEvaluator = <T>(value: T): T => value;

/**
 * A helper evaluator for stopping the pipe without emitting anything. Both the
 * result and the evaluator are shared singletons.
 */
export const lazyEmptyEvaluator = (): LazySkip => STOP;

/**
 * Emits `value` and stops the pipe.
 */
export const doneWith = <T>(value: T): LazyLast<T> => ({
  // The order of props is kept in sync with `SKIP_ITEM` and `STOP` so that v8
  // can build a single hidden class for both; keeping the reads inside `pipe`
  // monomorphic.
  $$remedaLazyRef: LAZY_REF,
  control: "last",
  isDone: true,
  value,
});

/**
 * Feeds every element of `value` through the rest of the pipe, one by one.
 */
export const manyItems = <T>(value: readonly T[]): LazyMany<T> => ({
  // The order of props is kept in sync with `SKIP_ITEM`, `STOP`, and
  // `doneWith`, so that v8 can build a single hidden class for both; keeping
  // the reads inside `pipe` monomorphic.
  $$remedaLazyRef: LAZY_REF,
  control: "many",
  isDone: false,
  value,
});

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

type ReadDataWhenOptions = {
  readonly dataParameterIndex?: number;
};

const DEFAULT_DATA_PARAMETER_INDEX = 2;

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
  evaluator: NoInfer<LazyEvaluator<T, R>>,
  {
    dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
  }: ReadDataWhenOptions = {},
): LazyEvaluator<T, R> =>
  callback.length === 0 || callback.length > dataParameterIndex
    ? readsData(evaluator)
    : evaluator;
