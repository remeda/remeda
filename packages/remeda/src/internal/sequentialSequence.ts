import type { UnaryFunction } from "./dataLastImplementation";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";

/**
 * Plans the run of lazy functions that starts at `startIndex`, the same run
 * `buildFusedSequence` would build: the consecutive lazy functions, ending after
 * the first reducing one.
 *
 * @returns The index after the run when none of its functions can stop the
 * pipe early, so they should run one after the other; `startIndex` when one of
 * them can, so the whole run should fuse.
 */
export function findSequentialSequenceEnd(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
): number {
  for (let index = startIndex; index < functions.length; index++) {
    const func = functions[index]!;
    if ("lazy" in func) {
      if (func.lazy.isStoppable) {
        return startIndex;
      }

      if (func.lazy.isReducing) {
        return index + 1;
      }
    } else {
      return index;
    }
  }

  return functions.length;
}
