import type { LAZY_REF } from "../utilityEvaluators";

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case. Anything else it needs to tell `pipe` (skip, stop, expand) is
 * carried by a `LazyControl` object, allocated only when needed.
 */
export type LazyResult<T = unknown> = T | LazyControl<T>;

export type LazyControl<T = unknown> = LazySkip | LazyLast<T> | LazyMany<T>;

type LazyControlBase = {
  // What tells a control object apart from a user item carrying the same
  // information is the identity of the reference object, not the shape
  // below: every key is a plain string and `typeof LAZY_REF` is structural,
  // so only the runtime comparison in `isLazyControl` is authoritative.
  readonly $$remedaLazyRef: typeof LAZY_REF;
};

export type LazySkip = LazyControlBase & {
  readonly control: "skip";
  readonly isDone: boolean;
  readonly value?: never;
};

export type LazyLast<T> = LazyControlBase & {
  readonly control: "last";
  readonly isDone: true;
  readonly value: T;
};

export type LazyMany<T> = LazyControlBase & {
  readonly control: "many";
  readonly isDone: boolean;
  readonly value: readonly T[];
};
