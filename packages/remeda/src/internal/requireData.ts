import type {
  LazyEvaluator,
  LazyEvaluatorMetadata,
} from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: a callback tried to access its `data` argument, but which was not provided to it. Remeda only provides `data` to callbacks that declare it as a regular parameter, and detects that via `Function.length`, which can't see parameters with default values, rest parameters, or `arguments` access. Declare `data` as a regular parameter, e.g. `(value, index, data) => ...`. If it already is, please report this at https://github.com/remeda/remeda/issues";

// Most callbacks have the input `data` as their 3rd parameter, as in all the
// standard library functions.
const DEFAULT_DATA_PARAMETER_INDEX = 2;

/**
 * Provided to a callback's `data` parameter whenever we believe it would not
 * be used. A callback only receives it by slipping through the arity gate.
 *
 * The goal of the object is to throw as early as possible for any kind of
 * usage of the parameter, so we can signal as early as possible to the user
 * that the `data` object they are relying on hasn't been computed for them, and
 * that this is most likely a bug in **our** detection code. This allows them to
 * work around it and report it so we can build more robust detections.
 *
 * @see requireDataByArity
 */
// @ts-expect-error [ts2322] -- No correct code ever observes this value, which is what `never` describes; it also lets the sentinel stand in for any `data` type without a cast at each use site.
export const UNEXPECTED_ACCESS_SENTINEL: never = new Proxy(
  {
    // We set our error message as a prop too so that even if the data
    // parameter is only logged via `console` or serialized via `JSON` the user
    // still gets a visible error message.
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
 * created closure, never a shared singleton.
 */
export const requireData = <T, R>(
  evaluator: LazyEvaluator<T, R>,
): LazyEvaluator<T, R> =>
  Object.assign(evaluator, {
    requiresData: true,
  } satisfies LazyEvaluatorMetadata);

/**
 * Marks an evaluator as needing `data` only when the user's `callback` is
 * likely to read it, based on it's signature.
 *
 * `Function.length` is 0 only when the *first* parameter is a rest parameter,
 * which is what wrappers that forward `arguments` (mocks, memoize, debounce)
 * look like, and we can't see through them, so those buffer too.
 *
 * Three holes are documented rather than guarded: a default parameter before
 * `data` (`(x, i = 0, data = []) => ...` reports 1), `arguments[i]` access,
 * and a trailing rest parameter (`(value, index, ...rest) => ...` reports 2).
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
