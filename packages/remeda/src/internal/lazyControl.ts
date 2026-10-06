// Control objects are told apart from user items by the identity of this
// symbol, which no ordinary value carries: JSON can't produce one, and code has
// to ask the registry for this exact key. It is registered rather than
// module-private so that separate copies of Remeda in one program (two
// installed versions, or the ESM and CJS builds side by side) recognize each
// other's control objects. Change the key if the shape of the control objects
// ever changes, so that copies on different shapes ignore each other's control
// objects instead of misreading them. A plain string key is used on purpose:
// every computed (symbol) key in an object literal costs
// V8 a keyed store on top of the literal's boilerplate (four symbol keys
// measured 10% slower on flatMap pipelines), prototype-identity checks cost
// more than the lookup they replace (1.5x to 2.9x), and null-prototype objects
// fall into dictionary mode (5x). Reference equality on a string key measured
// fastest on every pipeline shape.
const LAZY_REF = Symbol.for("$$remedaLazyRef");

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case. Anything else it needs to tell `pipe` (skip, stop, expand) is
 * carried by a `LazyControl` object, allocated only when needed.
 */
export type LazyResult<T = unknown> = T | LazyControl<T>;

type LazyControl<T = unknown> = LazySkip | LazyLast<T> | LazyMany<T>;

type LazyControlBase = {
  readonly $$remedaLazyRef: typeof LAZY_REF;
};

type LazySkip = LazyControlBase & {
  readonly control: "skip";
  readonly isDone: boolean;
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
  // Every control object lists its keys in this order, so V8 gives the two
  // singletons one hidden class and every `lastLazyValue`/`manyLazyValues`
  // result another, keeping the reads in `pipe` to two shapes.
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
 * Emits `value` and stops the pipe.
 */
export const lastLazyValue = <T>(value: T): LazyLast<T> => ({
  $$remedaLazyRef: LAZY_REF,
  control: "last",
  isDone: true,
  value,
});

/**
 * Feeds every element of `value` through the rest of the pipe, one by one.
 */
export const manyLazyValues = <T>(value: readonly T[]): LazyMany<T> => ({
  $$remedaLazyRef: LAZY_REF,
  control: "many",
  isDone: false,
  value,
});

export const isLazyControl = (result: unknown): result is LazyControl =>
  // The `typeof` guard is required because `in` throws on a primitive operand;
  // checking the key before reading it keeps the read off the path for the vast
  // majority of items.
  typeof result === "object" &&
  result !== null &&
  "$$remedaLazyRef" in result &&
  result.$$remedaLazyRef === LAZY_REF;
