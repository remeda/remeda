import type { StrictFunction } from "./types/StrictFunction";
import type { Tagged, Writable } from "type-fest";
import type { LazySlot } from "./lazyControl";
import type { StoppableLazyEvaluator } from "./types/LazyEvaluator";

/**
 * End the iteration without emitting anything.
 *
 * Only the evaluators of a `makeStoppable` implementation may return it.
 */
export const STOP: unique symbol = Symbol.for("remeda/lazy/stop");

/**
 * Emit the slot's `value` and end the iteration.
 *
 * @see lastLazyValue
 */
export const LAST: unique symbol = Symbol.for("remeda/lazy/last");

/**
 * The results only a stoppable evaluator may return: end the iteration, with
 * or without a last value.
 */
export type StoppableResult<T = never> = LazyLast<T> | typeof STOP;

export type StoppableMetadata = {
  readonly isStoppable: true;
};

// Tagged like `LazyMany` in `lazyControl.ts`: `LAST` only typechecks as the
// result of `lastLazyValue`, which writes a payload of the evaluator's declared
// result type.
type LazyLast<T> = Tagged<typeof LAST, "RemedaLazyLast", T>;

/**
 * Marks a lazy implementation whose evaluators can end the iteration early. On
 * arrays, `pipe` only fuses a run of lazy functions when one of them carries
 * this mark, as ending early is what makes feeding the items through the run
 * one by one pay off. The evaluators are declared as `StoppableLazyEvaluator`,
 * which a lazy implementation only accepts together with this mark.
 *
 * @see StoppableLazyEvaluator
 */
export const makeStoppable = <Func extends StrictFunction>(
  fn: Func,
): Func & StoppableMetadata =>
  Object.assign(fn, { isStoppable: true } satisfies StoppableMetadata);

/**
 * An evaluator that ends the iteration before emitting anything.
 *
 * Only a `makeStoppable` implementation may return it.
 */
export const lazyEmptyEvaluator: StoppableLazyEvaluator<
  unknown,
  never
> = (): typeof STOP => STOP;

/**
 * Emits `value` and ends the iteration.
 *
 * Only the evaluators of a `makeStoppable` implementation may return it.
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
