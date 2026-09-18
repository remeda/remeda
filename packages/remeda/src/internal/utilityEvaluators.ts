import type { EmptyObject, Tagged } from "type-fest";
import type { LazyEvaluator } from "./types/LazyEvaluator";
import type {
  LazyControl,
  LazyLast,
  LazyMany,
  LazySkip,
} from "./types/LazyResult";
import type { StrictFunction } from "./types/StrictFunction";

// Control objects are told apart from user items by the identity of this
// frozen object, which never leaves the package, so no value that enters a
// pipe can carry it whatever its origin. A plain string key is used on
// purpose: every computed (symbol) key in an object literal costs V8 a keyed
// store on top of the literal's boilerplate (four symbol keys measured 10%
// slower on flatMap pipelines), prototype-identity checks cost more than the
// lookup they replace (1.5x to 2.9x), and null-prototype objects fall into
// dictionary mode (5x). Reference equality on a string key measured fastest
// on every pipeline shape.
export const LAZY_REF = {} as Tagged<EmptyObject, "RemedaLazyRef">;

// Every control literal lists the same five keys (the reference plus
// `isDone`, `hasValue`, `hasMany`, `value`) in the same order so that V8
// gives them all a single hidden class, keeping the reads in `pipe`
// monomorphic.

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM: LazySkip = {
  $$remedaLazyRef: LAZY_REF,
  control: "skip",
  isDone: false,
};

const STOP: LazySkip = {
  $$remedaLazyRef: LAZY_REF,
  control: "skip",
  isDone: true,
};

/**
 * A helper evaluator for stopping the pipe without emitting anything. Both the
 * result and the evaluator are shared singletons.
 */
export const lazyEmptyEvaluator = (): LazySkip => STOP;

/**
 * A helper evaluator that passes every item through unchanged.
 */
export const lazyIdentityEvaluator = <T>(value: T): T => value;

/**
 * Emits `value` and stops the pipe.
 */
export const doneWith = <T>(value: T): LazyLast<T> => ({
  $$remedaLazyRef: LAZY_REF,
  control: "last",
  isDone: true,
  value,
});

/**
 * Feeds every element of `value` through the rest of the pipe, one by one.
 */
export const manyItems = <T>(value: readonly T[]): LazyMany<T> => ({
  $$remedaLazyRef: LAZY_REF,
  control: "many",
  isDone: false,
  value,
});

export const isLazyControl = (result: unknown): result is LazyControl =>
  // The `typeof` guard is required because `in` throws on a primitive operand;
  // checking the key before reading it keeps the read (and any user getter of
  // the same name) off the path for the vast majority of items.
  typeof result === "object" &&
  result !== null &&
  "$$remedaLazyRef" in result &&
  result.$$remedaLazyRef === LAZY_REF;

/**
 * Handed to every step that doesn't read `data`. Frozen so a callback that
 * slips through the arity gate (default parameters, `arguments`) can't corrupt
 * a module-wide singleton.
 */
export const NO_DATA: readonly never[] = Object.freeze([]);

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
