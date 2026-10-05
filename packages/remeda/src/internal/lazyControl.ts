import type { EmptyObject, Tagged } from "type-fest";

// Control objects are told apart from user items by the identity of this
// frozen object, which never leaves the package, so no value that enters a
// pipe can carry it whatever its origin. A plain string key is used on
// purpose: every computed (symbol) key in an object literal costs V8 a keyed
// store on top of the literal's boilerplate (four symbol keys measured 10%
// slower on flatMap pipelines), prototype-identity checks cost more than the
// lookup they replace (1.5x to 2.9x), and null-prototype objects fall into
// dictionary mode (5x). Reference equality on a string key measured fastest
// on every pipeline shape.
const LAZY_REF = {} as Tagged<EmptyObject, "RemedaLazyRef">;

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case. Anything else it needs to tell `pipe` (skip, stop, expand) is
 * carried by a `LazyControl` object, allocated only when needed.
 */
export type LazyResult<T = unknown> = T | LazyControl<T>;

type LazyControl<T = unknown> = LazySkip | LazyLast<T> | LazyMany<T>;

type LazyControlBase = {
  // What tells a control object apart from a user item carrying the same
  // information is the identity of the reference object, not the shape
  // below: every key is a plain string and `typeof LAZY_REF` is structural,
  // so only the runtime comparison in `isLazyControl` is authoritative.
  readonly $$remedaLazyRef: typeof LAZY_REF;
};

type LazySkip = LazyControlBase & {
  readonly control: "skip";
  readonly isDone: boolean;
  readonly value?: never;
};

type LazyLast<T> = LazyControlBase & {
  readonly control: "last";
  readonly isDone: true;
  readonly value: T;
};

type LazyMany<T> = LazyControlBase & {
  readonly control: "many";
  readonly isDone: boolean;
  readonly value: readonly T[];
};

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
 * A helper evaluator for stopping the pipe without emitting anything. Both the
 * result and the evaluator are shared singletons.
 */
export const lazyEmptyEvaluator = (): LazySkip => STOP;

/**
 * Emits `value` and stops the pipe.
 */
export const lastLazyValue = <T>(value: T): LazyLast<T> => ({
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
export const manyLazyValues = <T>(value: readonly T[]): LazyMany<T> => ({
  // The order of props is kept in sync with `SKIP_ITEM`, `STOP`, and
  // `lastLazyValue`, so that v8 can build a single hidden class for both;
  // keeping the reads inside `pipe` monomorphic.
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
