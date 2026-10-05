import type { LazyResult } from "./lazyControl";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: a callback read its `data` argument, which was not provided. Remeda only provides `data` to callbacks that declare it as a regular parameter, and detects that via `Function.length`, which can't see parameters with default values, rest parameters, or `arguments` access. Declare `data` as a regular parameter, e.g. `(value, index, data) => ...`. If it already is, please report this at https://github.com/remeda/remeda/issues";

const throwUnexpectedAccessError = (): never => {
  throw new Error(UNEXPECTED_ACCESS_MESSAGE);
};

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

/**
 * Providing an evaluator additional levers to control how `pipe` handles the
 * step.
 */
export type LazyControlMetadata = {
  /**
   * Some evaluators expect a `data` parameter which they provide to their
   * callback functions (e.g., `map`'s 3rd parameter); but managing this buffer
   * lazily requires extra work and memory, so it is only computed when
   * required, and otherwise replaced by `UNEXPECTED_ACCESS_SENTINEL`.
   *
   * @default false
   */
  readonly requiresData?: true;
};

export type LazyEvaluator<T = unknown, R = T> = ((
  item: T,
  index: number,
  data: readonly T[],
) => LazyResult<R>) &
  LazyControlMetadata;
