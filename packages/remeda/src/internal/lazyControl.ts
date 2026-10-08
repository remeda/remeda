import type { Writable } from "type-fest";

// Controls are told apart from user items by identity alone, so `pipe` never
// touches an item to classify it, and items that are proxies (e.g. reactive
// stores) see no probe. Each control is a registered symbol, which no ordinary
// value is: JSON can't produce one, and code has to ask the registry for these
// exact keys. They are registered rather than module-private so that separate
// copies of Remeda in one program (two installed versions, or the ESM and CJS
// builds side by side) recognize each other's controls. Change the keys if the
// protocol ever changes, so that copies on different protocols ignore each
// other's controls instead of misreading them.

/**
 * Skip the current item: nothing reaches the next step.
 */
export const SKIP_ITEM: unique symbol = Symbol.for("$$remedaLazySkip");

/**
 * Stop the pipe without emitting anything.
 */
export const STOP: unique symbol = Symbol.for("$$remedaLazyStop");

/**
 * Emit the slot's `value` and stop the pipe.
 *
 * @see lastLazyValue
 */
export const LAST: unique symbol = Symbol.for("$$remedaLazyLast");

/**
 * Feed every element of the slot's `values` through the rest of the pipe, one
 * by one.
 *
 * @see manyLazyValues
 */
export const MANY: unique symbol = Symbol.for("$$remedaLazyMany");

/**
 * A lazy evaluator returns the (possibly transformed) item itself in the
 * common case, and one of the controls above for anything else it needs to
 * tell `pipe` (skip, stop, expand).
 */
export type LazyResult<T = unknown> =
  T | typeof LAST | typeof MANY | typeof SKIP_ITEM | typeof STOP;

/**
 * Where an evaluator leaves the payload of a `LAST` or `MANY` result. The pipe
 * that calls the evaluator owns it, one per run, so nested pipes and other
 * copies of Remeda never share one, and reads it as soon as the evaluator
 * returns. Evaluators only ever hand it to `lastLazyValue` and
 * `manyLazyValues`.
 */
export type LazySlot = {
  readonly value: unknown;
  readonly values: readonly unknown[];
};

const NO_VALUES: readonly unknown[] = [];

export const createLazySlot = (): LazySlot => ({
  value: undefined,
  values: NO_VALUES,
});

/**
 * A helper evaluator for stopping the pipe without emitting anything.
 */
export const lazyEmptyEvaluator = (): typeof STOP => STOP;

/**
 * Emits `value` and stops the pipe.
 */
export function lastLazyValue(
  value: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The slot exists to carry the payload back to the pipe; this is one of the two helpers that write it.
  slot: Writable<LazySlot>,
): typeof LAST {
  slot.value = value;
  return LAST;
}

/**
 * Feeds every element of `values` through the rest of the pipe, one by one.
 */
export function manyLazyValues(
  values: readonly unknown[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The slot exists to carry the payload back to the pipe; this is one of the two helpers that write it.
  slot: Writable<LazySlot>,
): typeof MANY {
  slot.values = values;
  return MANY;
}
