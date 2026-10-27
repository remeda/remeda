import type { Tagged, Writable } from "type-fest";

/**
 * Skip the current item: nothing reaches the next step.
 */
export const SKIP_ITEM: unique symbol = Symbol.for("remeda/lazy/skip");

/**
 * Feed every element of the slot's `values` through the rest of the pipe, one
 * by one.
 *
 * @see manyLazyValues
 */
export const MANY: unique symbol = Symbol.for("remeda/lazy/many");

const NO_VALUES: readonly unknown[] = [];

/**
 * Where an evaluator leaves the payload of a control result.
 */
export type LazySlot = {
  readonly value: unknown;
  readonly values: readonly unknown[];
};

/**
 * A lazy evaluator can return an item, many items, or tell the executor that
 * the current item was filtered out (skipped).
 */
export type LazyResult<T> = T | LazyMany<T> | typeof SKIP_ITEM;

// The payload travels in the slot, so the tag is what ties its type to the
// control: `MANY` only typechecks as the result of `manyLazyValues`, which
// writes a payload of the evaluator's declared result type. That needs a result
// type other than `unknown`, which absorbs the rest of the union and so accepts
// a bare control too (e.g., `flat`'s evaluators, whose item type changes with
// depth).
type LazyMany<T> = Tagged<typeof MANY, "RemedaLazyMany", readonly T[]>;

export const createLazySlot = (): LazySlot => ({
  value: undefined,
  values: NO_VALUES,
});

/**
 * Feeds every element of `values` through the rest of the pipe, one by one.
 */
export function manyLazyValues<T>(
  values: readonly T[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The slot exists to carry the payload back to the pipe; this is one of the two helpers that write it.
  slot: Writable<LazySlot>,
): LazyMany<T> {
  slot.values = values;
  // @ts-expect-error [ts2322] -- The tag exists only at compile time; at runtime the control is the bare symbol, and its payload is the `values` just written to the slot.
  return MANY;
}
