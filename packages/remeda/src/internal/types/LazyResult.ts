import type { LAZY_REF } from "../utilityEvaluators";

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case. Anything else it needs to tell `pipe` (skip, stop, expand) is
 * carried by a `LazyControl` object, allocated only when needed.
 */
export type LazyResult<T = unknown> = T | LazyControl<T>;

export type LazyControl<T = unknown> =
  LazySkip | LazyStop | LazyLast<T> | LazyMany<T>;

type LazyBase = {
  // What tells a control object apart from a user item carrying the same
  // information is the identity of the reference object, not the shape
  // below: every key is a plain string and `typeof LAZY_REF` is structural,
  // so only the runtime comparison in `isLazyControl` is authoritative.
  readonly $$remedaLazyRef: typeof LAZY_REF;
};

export type LazySkip = LazyBase & {
  readonly value?: never;
  readonly hasMany: false;
  readonly hasValue: false;
  readonly isDone: false;
};

export type LazyStop = LazyBase & {
  readonly value?: never;
  readonly hasMany: false;
  readonly hasValue: false;
  readonly isDone: true;
};

export type LazyLast<T> = LazyBase & {
  readonly value: T;
  readonly hasMany: false;
  readonly hasValue: true;
  readonly isDone: true;
};

export type LazyMany<T> = LazyBase & {
  readonly value: readonly T[];
  readonly hasMany: true;
  readonly hasValue: true;
  readonly isDone: boolean;
};
