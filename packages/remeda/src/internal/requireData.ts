import type { Tagged } from "type-fest";
import type {
  LazyEvaluator,
  LazyEvaluatorMetadata,
} from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: a callback's `data` argument was read, but Remeda didn't provide it. Remeda only provides `data` to callbacks that declare it as a plain parameter, detected via `Function.length`, which misses a default value on `data` or an earlier parameter, a rest parameter after other parameters, `arguments` access, and mocks whose implementation declares fewer parameters. Declare `data` in the callback (or the mock's implementation), e.g. `(value, index, data) => ...`. If it already is, please report this at https://github.com/remeda/remeda/issues";

// Most callbacks have the input `data` as their 3rd parameter, as in all the
// standard library functions.
const DEFAULT_DATA_PARAMETER_INDEX = 2;

/**
 * Provided to a callback's `data` parameter whenever we believe it would not
 * be used. A callback only receives it by slipping through the arity gate.
 *
 * Every operation on it throws, so the first touch signals that `data` wasn't
 * collected for this callback: usually one of the holes documented on
 * `requireDataByArity`, otherwise a detection bug worth reporting.
 *
 * @see requireDataByArity
 */
// @ts-expect-error [ts2322] -- The proxy isn't an array, but any attempt to use it as one throws, so no code that relies on its type can run past the first touch.
export const UNEXPECTED_ACCESS_SENTINEL: Tagged<
  readonly never[],
  "RemedaUnexpectedAccessSentinel"
> = new Proxy(
  {
    // `console.log` and devtools print a proxy's target without running its
    // traps, so the message lives on the target too and a logged `data` still
    // explains itself.
    error: UNEXPECTED_ACCESS_MESSAGE,
  },
  {
    // Reads: what a callback that slipped through the arity gate does with it.
    get: alwaysThrow,
    getOwnPropertyDescriptor: alwaysThrow,
    getPrototypeOf: alwaysThrow,
    has: alwaysThrow,
    isExtensible: alwaysThrow,
    ownKeys: alwaysThrow,

    // Writes: would otherwise reach the target, which every pipe shares.
    defineProperty: alwaysThrow,
    deleteProperty: alwaysThrow,
    preventExtensions: alwaysThrow,
    set: alwaysThrow,
    setPrototypeOf: alwaysThrow,

    // `apply` and `construct` are left out: they only fire for callable
    // targets.
  },
);

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
): LazyEvaluator<T, R> =>
  Object.assign(evaluator, {
    requiresData: true,
  } satisfies LazyEvaluatorMetadata);

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

function alwaysThrow(): never {
  throw new Error(UNEXPECTED_ACCESS_MESSAGE);
}
