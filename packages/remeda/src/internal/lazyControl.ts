// A lazy evaluator answers `pipe` with the item itself, or with a control
// symbol: the ones defined here skip the item or expand it, and the ones in
// `makeStoppable.ts` end the iteration. Controls are told apart from user
// items by identity alone, so `pipe` never touches an item to classify it, and
// items that are proxies (e.g. reactive stores) see no probe. Each control is a
// registered symbol, which no ordinary value is: JSON can't produce one, and
// code has to ask the registry for these exact keys. They are registered
// rather than module-private so that separate copies of Remeda in one program
// (two installed versions, or the ESM and CJS builds side by side)
// interoperate while they share this protocol. Mixing copies on different
// protocols in one pipe is unsupported; changing the keys along with the
// protocol keeps a future shape change from being read as this one.

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
 * Where an evaluator leaves the payload of a control result: a single `value`,
 * or a list of `values`. The pipe that calls the evaluator owns it, one per
 * run, so nested pipes and other copies of Remeda never share one, and reads
 * it as soon as the evaluator returns. Evaluators only ever hand it to the
 * helpers that return those controls.
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
