import type { LAZY_CONTROL } from "../utilityEvaluators";

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case. Anything else it needs to tell `pipe` (skip, stop, expand) is
 * carried by a `LazyControl` object, allocated only when needed.
 */
export type LazyResult<T = unknown> = T | LazyControl<T>;

export type LazyControl<T = unknown> =
  LazySkip | LazyStop | LazyLast<T> | LazyMany<T>;

// The brand is the only thing that separates a control object from a user
// item that happens to carry the same keys.
type Branded = { readonly [LAZY_CONTROL]: true };

export type LazySkip = Branded & {
  readonly done: false;
  readonly hasNext: false;
  readonly hasMany: false;
  readonly next: undefined;
};

export type LazyStop = Branded & {
  readonly done: true;
  readonly hasNext: false;
  readonly hasMany: false;
  readonly next: undefined;
};

export type LazyLast<T> = Branded & {
  readonly done: true;
  readonly hasNext: true;
  readonly hasMany: false;
  readonly next: T;
};

export type LazyMany<T> = Branded & {
  readonly done: boolean;
  readonly hasNext: true;
  readonly hasMany: true;
  readonly next: readonly T[];
};
