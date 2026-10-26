import type { StrictFunction } from "./types/StrictFunction";
import type { Tagged, Writable } from "type-fest";
import type { LazySlot } from "./lazyControl";
import type { StoppableLazyEvaluator } from "./types/LazyEvaluator";

/**
 * Stop the pipe without emitting anything.
 *
 * @see `makeStoppable` Only stoppable evaluators can use this helper.
 */
export const STOP: unique symbol = Symbol.for("remeda/lazy/stop");

/**
 * Emit the slot's `value` and stop the pipe.
 *
 * @see `lastLazyValue`
 */
export const LAST: unique symbol = Symbol.for("remeda/lazy/last");

/**
 * Stoppable evaluators can short-circuit execution by throwing the towel in
 * with or without a last element.
 */
export type StoppableResult<T = never> = LazyLast<T> | typeof STOP;

export type StoppableMetadata = {
  readonly isStoppable: true;
};

// The payload travels in the slot, so the tag is what ties its type to the
// control: `LAST` and `MANY` only typecheck as the result of the helpers that
// write a payload of the evaluator's declared result type. That needs a result
// type other than `unknown`, which absorbs the rest of the union and so accepts
// a bare control too (e.g., `flat`'s evaluators, whose item type changes with
// depth).
type LazyLast<T> = Tagged<typeof LAST, "RemedaLazyLast", T>;

/**
 * Allow an evaluator to return the `STOP` and `LAST` control symbols.
 *
 * @see `StoppableLazyEvaluator`
 */
export const makeStoppable = <Func extends StrictFunction>(
  fn: Func,
): Func & StoppableMetadata =>
  Object.assign(fn, { isStoppable: true } satisfies StoppableMetadata);

/**
 * A helper evaluator for stopping the pipe without emitting anything.
 *
 * @see `makeStoppable` Only stoppable evaluators can use this helper.
 */
export const lazyEmptyEvaluator: StoppableLazyEvaluator<
  unknown,
  never
> = (): typeof STOP => STOP;

/**
 * Emits `value` and ends the fused sequence it is part of.
 *
 * @see `makeStoppable` Only stoppable evaluators can use this helper.
 */
export function lastLazyValue<T>(
  value: T,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The slot exists to carry the payload back to the pipe; this is one of the two helpers that write it.
  slot: Writable<LazySlot>,
): LazyLast<T> {
  slot.value = value;
  // @ts-expect-error [ts2322] -- The tag exists only at compile time; at runtime the control is the bare symbol, and its payload is the `value` just written to the slot.
  return LAST;
}
