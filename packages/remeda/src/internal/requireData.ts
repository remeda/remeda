import type { LazyEvaluator, LazyEvaluatorMetadata } from "./lazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

type RequireDataByArityOptions = {
  readonly dataParameterIndex?: number;
};

const DEFAULT_DATA_PARAMETER_INDEX = 2;

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: a callback read its `data` argument, which was not provided. Remeda only provides `data` to callbacks that declare it as a regular parameter, and detects that via `Function.length`, which can't see parameters with default values, rest parameters, or `arguments` access. Declare `data` as a regular parameter, e.g. `(value, index, data) => ...`. If it already is, please report this at https://github.com/remeda/remeda/issues";

const throwUnexpectedAccessError = (): never => {
  throw new Error(UNEXPECTED_ACCESS_MESSAGE);
};

/**
 * Marks an evaluator that reads `data` itself, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton such as `lazyIdentityEvaluator` or
 * `lazyEmptyEvaluator`.
 */
export const requireData = <T, R>(
  evaluator: LazyEvaluator<T, R>,
): LazyEvaluator<T, R> =>
  Object.assign(evaluator, {
    requiresData: true,
  } satisfies LazyEvaluatorMetadata);

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

/**
 * Handed as `data` to every step that doesn't read it. A callback only receives
 * it by slipping through the arity gate (see `requireDataByArity`), and no stand-in
 * value would be correct there: an empty array contradicts the callback's own
 * type (`NonEmptyPrefix` guarantees a first item) and lets the mistake through
 * silently. Instead, every operation that can be trapped (property access,
 * iteration, coercion, `in`, `instanceof`, ...) throws on first contact, so the
 * mistake surfaces at the line that made it.
 *
 * Logging is the one common read that can't be trapped: `console.log` and
 * browser devtools display a proxy's target directly. The target carries the
 * same message so that a logged `data` explains itself too.
 */
// @ts-expect-error [ts2322] -- No correct code ever observes this value, which is what `never` describes; it also lets the sentinel stand in for any `data` type without a cast at each use site.
export const UNEXPECTED_ACCESS_SENTINEL: never = new Proxy(
  { error: UNEXPECTED_ACCESS_MESSAGE },
  {
    // Reads: what a callback that slipped through the arity gate does with it.
    get: throwUnexpectedAccessError,
    getOwnPropertyDescriptor: throwUnexpectedAccessError,
    getPrototypeOf: throwUnexpectedAccessError,
    has: throwUnexpectedAccessError,
    isExtensible: throwUnexpectedAccessError,
    ownKeys: throwUnexpectedAccessError,

    // Writes: would otherwise reach the target, which every pipe shares.
    defineProperty: throwUnexpectedAccessError,
    deleteProperty: throwUnexpectedAccessError,
    preventExtensions: throwUnexpectedAccessError,
    set: throwUnexpectedAccessError,
    setPrototypeOf: throwUnexpectedAccessError,

    // `apply` and `construct` are left out: they only fire for callable
    // targets.
  },
);
