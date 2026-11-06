import { lazyDataLastImplementation } from "../src/internal/lazyDataLastImplementation";
import {
  makeStoppable,
  type StoppableLazyEvaluator,
} from "../src/internal/makeStoppable";
import type { IterableContainer } from "../src/internal/types/IterableContainer";

/**
 * A `pipe` step that makes the sequence of lazy functions it's part of evaluate
 * lazily, item by item, even on an array. `pipe` fuses a sequence only when one
 * of its functions can end the iteration early; this step is marked as one that
 * can, but passes every item through, so the rest of the sequence sees them
 * all.
 *
 * When the sequence doesn't fuse (the step is alone, or `pipe` no longer fuses
 * it), the step throws, so a test that relies on it can't quietly pass on the
 * data-first implementations instead.
 */
export const forceFusion = <T extends IterableContainer>(): ((
  data: T,
) => T[number][]) =>
  lazyDataLastImplementation(throwNotFused, [], lazyImplementation);

const throwNotFused = (): never => {
  throw new Error("forceFusion: the sequence wasn't evaluated lazily");
};

const passThrough: StoppableLazyEvaluator = (value) => value;

const lazyImplementation = makeStoppable(
  (): StoppableLazyEvaluator => passThrough,
);
