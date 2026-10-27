import type { Tagged, Writable } from "type-fest";
import type { LazyResult, LazySlot } from "./lazyControl";
import type { BaseEvaluator } from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * End the iteration without emitting anything.
 */
export const STOP: unique symbol = Symbol.for("remeda/lazy/stop");

/**
 * Emit the slot's `value` and end the iteration.
 *
 * @see lastLazyValue
 */
export const LAST: unique symbol = Symbol.for("remeda/lazy/last");

/**
 * An evaluator that can also use pipe short-circuiting controls to stop
 * pipe evaluations in the middle.
 *
 * @see makeStoppable
 */
export type StoppableLazyEvaluator<T = unknown, R = T> = BaseEvaluator<
  T,
  LazyResult<R> | StoppableResult<R>,
  "lazy" | "stoppable"
>;

/**
 * The results only a stoppable evaluator may return: end the iteration, with
 * or without a last value.
 */
export type StoppableResult<T = never> = LazyLast<T> | typeof STOP;

export type StoppableMetadata = {
  readonly isStoppable: true;
};

// Tagged like `LazyMany` in `lazyControl.ts`.
type LazyLast<T> = Tagged<typeof LAST, "RemedaLazyLast", T>;

/**
 * Marks a lazy implementation whose evaluators can end the iteration early.
 *
 * @see StoppableLazyEvaluator
 */
export const makeStoppable = <Func extends StrictFunction>(
  fn: Func,
): Func & StoppableMetadata =>
  Object.assign(fn, { isStoppable: true } satisfies StoppableMetadata);

/**
 * An evaluator that ends the iteration before emitting anything.
 */
export const lazyEmptyEvaluator: StoppableLazyEvaluator<
  unknown,
  never
> = (): typeof STOP => STOP;

/**
 * Emits `value` and ends the iteration.
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
