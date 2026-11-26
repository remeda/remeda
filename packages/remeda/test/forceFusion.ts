import { lazyDataLastImplementation0 } from "../src/internal/lazyDataLastImplementation";
import {
  makeStoppable,
  type StoppableLazyEvaluator,
} from "../src/internal/makeStoppable";

/**
 * A `pipe` step that makes the sequence of lazy functions it's part of evaluate
 * lazily, item by item, even on an array. `pipe` fuses a sequence only when one
 * of its functions can end the iteration early; this step is marked as one that
 * can, but passes every item through, so the rest of the sequence sees them
 * all.
 *
 * To test a function as a later step, it goes before that function: on an
 * array, the first step of a fused sequence gets the complete input as its
 * `data`, as a data-first call does, and only the steps after it get the items
 * processed so far.
 */
export const forceFusion = <T extends readonly unknown[]>(): ((
  data: T,
) => T[number][]) =>
  lazyDataLastImplementation0(() => {
    // When the sequence doesn't fuse (the step is alone, or `pipe` no longer
    // fuses it), the step throws, so a test that relies on it can't quietly
    // pass on the data-first implementations instead.
    throw new Error("forceFusion: the sequence wasn't evaluated lazily");
  }, lazyImplementation);

const lazyImplementation = makeStoppable(() => passThrough);

const passThrough: StoppableLazyEvaluator = (value) => value;
