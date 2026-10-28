import { lazyDataLastImplementation } from "../src/internal/lazyDataLastImplementation";
import {
  makeStoppable,
  type StoppableLazyEvaluator,
} from "../src/internal/makeStoppable";
import type { IterableContainer } from "../src/internal/types/IterableContainer";

/**
 * A `pipe` step that makes the run of lazy functions it's part of evaluate
 * lazily, item by item, even on an array. `pipe` fuses a run only when one of
 * its functions can end the iteration early; this step is marked as one that
 * can, but passes every item through, so the rest of the run sees them all.
 *
 * When the run doesn't fuse (the step is alone, or `pipe` no longer fuses it),
 * the step throws, so a test that relies on it can't quietly pass on the
 * data-first implementations instead.
 */
export const forceFusion = <T extends IterableContainer>(): ((
  data: T,
) => T[number][]) =>
  lazyDataLastImplementation(throwNotFused, [], lazyImplementation);

const throwNotFused = (): never => {
  throw new Error("forceFusion: the run wasn't evaluated lazily");
};

const passThrough: StoppableLazyEvaluator = (value) => value;

const lazyImplementation = makeStoppable(
  (): StoppableLazyEvaluator => passThrough,
);
